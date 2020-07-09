import type { Api, FileId, FileInfo } from './type';

const d = new Date();

export const RootId = '' as FileId;

export const Root: FileInfo = {
  id: RootId,
  name: 'Root',
  path: [],
  modifiedTime: d,
  readonly: false,
  kind: 'dir',
};

const delay = <T>(v: T, timeMs: number): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs, v);
  });
};

export const makeDummyApi = (): Api => {
  let dirs: { [id: string]: Array<FileInfo> } = { [RootId]: [] };
  let files: { [id: string]: FileInfo } = {
    [RootId]: Root,
  };

  let ls = (id: FileId) => delay(dirs[id], Math.random() * 1000);

  let rm = (ids: FileId[]) => {
    for (let id in ids) {
      delete dirs[id];
      delete files[id];
    }
    for (let id in Object.keys(dirs)) {
      dirs[id] = dirs[id].filter(
        (fi) => ids.findIndex((id) => id === fi.id) >= 0,
      );
    }
    return Promise.resolve();
  };

  let i = 1;

  let makeDir = (parentId: FileId, name: string): Promise<FileInfo> => {
    let parent = files[parentId];
    let path = parent.path.concat(parent);
    let fi: FileInfo = {
      id: String(i++) as FileId,
      name,
      path,
      modifiedTime: d,
      readonly: false,
      kind: 'dir',
    };

    files[fi.id] = fi;
    dirs[fi.id] = [];
    dirs[parentId] = dirs[parentId].concat(fi);

    return delay(fi, Math.random() * 1000);
  };

  let rename = (id: FileId, name: string): Promise<FileInfo> => {
    files[id] = { ...files[id], name };
    return delay(files[id], 100);
  };

  let show = (id: FileId): Promise<FileInfo> => {
    return delay(files[id], Math.random() * 1000);
  };

  return {
    ls,
    rm,
    makeDir,
    rename,
    show,
  };
};
