import { formatDistance } from 'date-fns';
import React from 'react';

import { FileInfo, Folder, isFile, isFolder } from '../types';

const noop = (_: any) => {};

export type FileTableProps = {
  folder: Folder;
  className?: string;
  onFolderDoubleClick?: (id: string) => void;
};

export function FileTable(props: FileTableProps) {
  let {
    folder: { children = [] },
    className = '',
    onFolderDoubleClick = noop,
  } = props;

  let files = React.useMemo(() => defaultSort(children), [children]);

  let now = new Date();

  return (
    <table className={'table-auto border w-full text-sm ' + className}>
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 border w-full">Name</th>
          <th className="px-4 py-2 border">Size</th>
          <th className="px-4 py-2 border">Last Modified</th>
        </tr>
      </thead>
      <tbody>
        {files.map((f) => (
          <tr
            className="select-none cursor-pointer hover:bg-blue-100 whitespace-no-wrap"
            key={f.id}
            onDoubleClick={() => {
              if (isFolder(f)) {
                onFolderDoubleClick(f.id);
              }
              console.log(f);
            }}
          >
            <td className="px-4 py-2 border-t border-b">{f.name}</td>
            <td className="px-4 py-2 border-t border-b text-gray-500">
              {formatSize(isFile(f) ? f.size : null)}
            </td>
            <td className="px-4 py-2 border-t border-b text-gray-500">
              {formatDistance(new Date(f.modifiedTime), now, {
                addSuffix: true,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const formatSize = (size?: number | null) => {
  if (size == undefined || size == null) return '---';
  if (size < 1024) return `${size} bytes`;
  if (size < 1024 * 1024) {
    let sizeInKB = Math.floor(size / 1024);
    return `${sizeInKB} Kb`;
  }
  let sizeInMB = Math.floor(size / 1024 / 1024);
  return `${sizeInMB} Mb`;
};

const defaultSort = (files: FileInfo[]) => {
  return files.concat().sort((f1, f2) => {
    // make sure folder is on top
    if (isFolder(f1) && !isFolder(f2)) return -1;
    if (f1.name < f2.name) return -1;
    if (f1.name > f2.name) return 1;
    return 0;
  });
};
