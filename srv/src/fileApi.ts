import fs from 'fs';
import path from 'path';
import { fileExistError } from './error';
const fsp = fs.promises;

const PUBLIC = path.join(__dirname, '../public/files');

export const normalize = (p: string) => {
  return path.resolve(path.join(PUBLIC, path.normalize(path.join('/', p))));
};

export const toId = (p: string) => {
  let rel = path.relative(PUBLIC, p);
  // rel empty => root
  if (!rel) return '/';
  return rel;
};

export const getPaths = (p: string) => {
  let rel = path.relative(PUBLIC, p);
  // rel empty => root
  if (!rel) return [];
  let [ps] = path
    .dirname(rel)
    .split(path.sep)
    .reduce(
      ([acc, current], dir) => {
        let p = path.join(current, dir);
        return [acc.concat(p), p];
      },
      [[] as string[], '/'],
    );
  return ps;
};

export type FileStat = {
  id: string;
  name: string;
  modifiedTime: Date;
  kind: 'dir' | 'file';
  path: Array<{ id: string }>;
  size: number;
};

export const loadFile = async (id: string): Promise<FileStat> => {
  let fn = normalize(id);
  let name = path.basename(fn);
  let stat = await fsp.stat(fn);
  let kind: 'dir' | 'file' = stat.isDirectory() ? 'dir' : 'file';
  return {
    id,
    name,
    modifiedTime: stat.mtime,
    kind,
    path: getPaths(fn).map((id) => ({ id })),
    size: stat.size,
  };
};

export const loadDir = async (id: string) => {
  let fn = normalize(id);
  let result = await fsp.readdir(fn);
  return result.map((n) => ({
    id: path.join('/', path.relative(PUBLIC, path.join(fn, n))),
  }));
};

type FileUpload = {
  file: Promise<{ createReadStream: () => fs.ReadStream }>;
  name: string;
};

export const uploadFiles = async (
  parentId: string,
  files: Array<FileUpload>,
) => {
  let children = await fsp.readdir(normalize(parentId));

  let [existings, toCreates] = files.reduce(
    ([existings, toCreates], f) => {
      let { name } = f;
      if (children.indexOf(name) >= 0) {
        existings.push(f);
      } else {
        toCreates.push(f);
      }
      return [existings, toCreates];
    },
    [[], []] as [FileUpload[], FileUpload[]],
  );

  let errors = existings.map(({ name }) => fileExistError(name));
  let createds = await Promise.all(
    toCreates.map(async (f) => {
      let newId = path.join(parentId, f.name);
      let wstream = fs.createWriteStream(normalize(newId));
      let rstream = (await f.file).createReadStream();
      await new Promise((resolve, reject) =>
        rstream.pipe(wstream).on('finish', resolve).on('error', reject),
      );
      return { id: newId };
    }),
  );

  return { files: createds, errors: errors.length ? errors : null };
};
