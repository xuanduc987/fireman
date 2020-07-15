import { useParams, useHistory } from 'react-router-dom';
import React, { useRef, useMemo } from 'react';

import { useLsQuery } from './generated/graphql';

const formatSize = (size?: number | null) => {
  if (size == undefined || size == null) return '---';
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) {
    let sizeInKB = Math.floor(size / 1024);
    return `${sizeInKB}KB`;
  }
  let sizeInMB = Math.floor(size / 1024 / 1024);
  return `${sizeInMB}MB`;
};

const isFolder = (f: {
  __typename?: string | undefined;
}): f is { __typename: 'Folder' } => f.__typename === 'Folder';

const isFile = (f: {
  __typename?: string | undefined;
}): f is { __typename: 'File' } => f.__typename === 'File';

function FileManager() {
  let { id } = useParams();
  let workingDir = useMemo(() => {
    if (!id) return '/';
    return atob(id);
  }, [id]);

  let history = useHistory();

  const move = (id: string) => {
    history.push('/' + btoa(id));
  };

  const [res] = useLsQuery({ variables: { dir: workingDir } });

  let lastClick = useRef(0);

  if (res.fetching || !res.data) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

  let children =
    res.data.fileById.__typename === 'Folder'
      ? res.data.fileById.children.slice(0)
      : [];

  children.sort((f1: any, f2: any) => {
    if (f1.size === undefined) return f2.size === undefined ? 0 : -1;
    if (f1.name < f2.name) return -1;
    if (f1.name > f2.name) return 1;
    return 0;
  });

  return (
    <div className="container mx-auto h-full">
      <div className="p-4 h-full">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border w-32">Size</th>
            </tr>
          </thead>
          <tbody>
            {children.map((f) => (
              <tr
                className="select-none cursor-pointer hover:bg-blue-100"
                key={id}
                onClick={() => {
                  let then = lastClick.current;
                  lastClick.current = Date.now();
                  if (lastClick.current - then > 300) return;
                  if (isFolder(f)) {
                    move(f.id);
                  }
                }}
              >
                <td className="px-4 py-2 border">{f.name}</td>
                <td className="px-4 py-2 border">
                  {formatSize(isFile(f) ? f.size : null)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileManager;
