type FileCommon = {
  id: string;
  name: string;
  modifiedTime: string,
};

export type Folder = FileCommon & {
  __typename: 'Folder';
  children?: FileInfo[];
};

export type FileT = FileCommon & {
  __typename: 'File';
  size: number;
};

export type FileInfo = Folder | FileT;

export const isFolder = (f: FileInfo): f is Folder => f.__typename === 'Folder';

export const isFile = (f: FileInfo): f is FileT => f.__typename === 'File';

export type UploadState = 'uploading' | 'fail' | 'done';
