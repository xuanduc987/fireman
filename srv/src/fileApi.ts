import fs from 'fs';
import path from 'path';
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

export const uploadFile = async (
  parentId: string,
  name: string,
  stream: fs.ReadStream,
) => {
  let fn = normalize(path.join(parentId, name));
  let exist = false;
  try {
    let stat = await loadFile(fn);
    if (stat.kind === 'file') exist = true;
  } catch {
    exist = false;
  }
  if (exist) throw new Error('File exsisted ' + fn);
  let wstream = fs.createWriteStream(fn);
  await new Promise((resolve, reject) =>
    stream.pipe(wstream).on('finish', resolve).on('error', reject),
  );
  return { id: toId(fn) };
};
