import { formatDistance } from 'date-fns';
import React from 'react';
import SVG from 'react-inlinesvg';
import file from 'heroicons/outline/document.svg';
import folder from 'heroicons/solid/folder.svg';

import { FileInfo, Folder, isFile, isFolder } from '../types';
import { noop } from '../utils';

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
    <table className={'table-auto border w-full whitespace-no-wrap text-sm ' + className}>
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="px-4 py-2 border-l border-r w-full">Name</th>
          <th className="px-4 py-2 border-l border-r">Size</th>
          <th className="px-4 py-2 border-l border-r">Last Modified</th>
        </tr>
      </thead>
      <tbody>
        {files.map((f) => (
          <tr
            className="select-none cursor-pointer hover:bg-blue-100"
            key={f.id}
            onDoubleClick={() => {
              if (isFolder(f)) {
                onFolderDoubleClick(f.id);
              }
            }}
          >
            <td className="px-4 py-2 border-t border-b">
              <SVG
                src={isFolder(f) ? folder : file}
                className="inline-block h-5 mr-4"
              />
              {f.name}
            </td>
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

const round = (n: number): number => {
  return Math.round(n * 10)/10
}

const formatSize = (size?: number | null) => {
  if (size == undefined || size == null) return '---';
  if (size < 1024) return `${size} bytes`;
  if (size < 1024 * 1024) {
    let sizeInKB = round(size / 1024);
    return `${sizeInKB} KB`;
  }
  let sizeInMB = round(size / 1024 / 1024);
  return `${sizeInMB} MB`;
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
