declare const fileIdBrand: unique symbol;
export type FileId = string & { [fileIdBrand]: never };

export type FileInfo = {
  id: FileId;
  name: string;
  path: Array<string>;
  modifiedTime: Date;
  readonly: boolean;
  kind: 'dir' | 'file';
};

export interface Api {
  ls(id: FileId): Promise<FileInfo[]>;
  rm(ids: FileId[]): Promise<void>;
  makeDir(parent: FileId, name: string): Promise<FileInfo>;
  rename(id: FileId, name: string): Promise<FileInfo>;
}
