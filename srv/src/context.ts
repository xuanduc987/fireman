import DataLoader from 'dataloader';

import { promises as fs } from 'fs';
import path from 'path';

const PUBLIC = path.join(__dirname, '../public/files');

const normalize = (p: string) => {
  return path.resolve(path.join(PUBLIC, path.normalize(path.join('/', p))));
};

const getPaths = (p: string) => {
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

const loadFile = async (id: string): Promise<FileStat> => {
  let fn = normalize(id);
  let name = path.basename(fn);
  let stat = await fs.stat(fn);
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

const loadFiles = async (ids: readonly string[]) => {
  return Promise.all(ids.map(loadFile));
};

const loadDir = async (id: string) => {
  let fn = normalize(id);
  let result = await fs.readdir(fn);
  return result.map((n) => ({
    id: path.join('/', path.relative(PUBLIC, path.join(fn, n))),
  }));
};

const loadDirs = async (ids: readonly string[]) => {
  return Promise.all(ids.map(loadDir));
};

export const createContext = () => ({
  fileLoader: new DataLoader(loadFiles),
  dirLoader: new DataLoader(loadDirs),
});

export type Context = ReturnType<typeof createContext>;
