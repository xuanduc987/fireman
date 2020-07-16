import fs from 'fs';
import path from 'path';

import { fileExistError, fileNotFoundError } from './error';

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
      let newFn = normalize(newId);
      let rstream = (await f.file).createReadStream();
      let wstream = fs.createWriteStream(newFn);
      await new Promise((resolve, reject) =>
        rstream
          .pipe(wstream)
          .on('finish', resolve)
          .on('error', (e) => {
            reject(e);
            fs.unlinkSync(newFn);
          }),
      );
      return { id: newId };
    }),
  );

  return { files: createds, errors: errors.length ? errors : null };
};

export const createFolder = async (parentId: string, name: string) => {
  let newId = path.join(parentId, name);
  let exist = true;
  try {
    await loadFile(newId);
  } catch (_) {
    exist = false;
  }
  if (exist) return { error: fileExistError(newId) };
  await fsp.mkdir(normalize(newId));
  return { folder: { id: newId } };
};

const removeFileRecur = async (fileId: string): Promise<[number, any[]]> => {
  let result = [0, []] as [number, any[]];
  try {
    let stat = await loadFile(fileId);
    let fn = normalize(fileId);
    if (stat.kind === 'dir') {
      let children = await fsp.readdir(fn);
      let r = await Promise.all(
        children.map((f) => removeFileRecur(path.join(fileId, f))),
      );
      result = r.reduce(([x, e1], [y, e2]) => [x + y, e1.concat(e2)]);
    }
    await fsp.unlink(fn);
    return [result[0] + 1, result[1]];
  } catch (_) {
    return [result[0], result[1].concat(fileNotFoundError(fileId))];
  }
};

export const removeFiles = async (fileIds: string[]) => {
  let [removed, errors] = (
    await Promise.all(fileIds.map(removeFileRecur))
  ).reduce(([x, e1], [y, e2]) => [x + y, e1.concat(e2)]);
  return { removed, errors: errors.length ? errors : null };
};
