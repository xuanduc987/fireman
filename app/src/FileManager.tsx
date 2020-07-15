import React, { useState, useRef } from 'react';
import { useLsQuery } from './generated/graphql';

const formatSize = (size: undefined | number) => {
  if (size === undefined) return '---';
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) {
    let sizeInKB = Math.floor(size / 1024);
    return `${sizeInKB}KB`;
  }
  let sizeInMB = Math.floor(size / 1024 / 1024);
  return `${sizeInMB}MB`;
};

function FileManager() {
  const [workingDir, setWorkingdir] = useState('/');
  const [history, setHistory] = useState([] as string[]);

  const move = (id: string) => {
    let last = workingDir;
    setWorkingdir(id);
    setHistory(history.concat(last));
  };

  const moveBack = () => {
    let last = history[history.length - 1];
    if (!last) return;
    let newHis = history.splice(0, history.length - 1);
    setWorkingdir(last);
    setHistory(newHis);
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
        <button
          className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
          disabled={history.length === 0}
          onClick={moveBack}
        >
          {'<'}
        </button>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border w-32">Size</th>
            </tr>
          </thead>
          <tbody>
            {children.map(({ id, name, size, __typename }: any) => (
              <tr
                className="select-none cursor-pointer hover:bg-blue-100"
                key={id}
                onClick={() => {
                  let then = lastClick.current;
                  lastClick.current = Date.now();
                  if (lastClick.current - then > 300) return;
                  if (__typename === 'Folder') {
                    move(id);
                  }
                }}
              >
                <td className="px-4 py-2 border">{name}</td>
                <td className="px-4 py-2 border">{formatSize(size)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileManager;
