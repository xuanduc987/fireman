import { useParams, useHistory } from 'react-router-dom';
import React, { useMemo, useState } from 'react';

import { FileTable } from './components/FileTable';
import { isFolder } from './types';
import { useDocTitle } from './hooks';
import { useLsQuery } from './generated/graphql';

function FileManager() {
  let { id } = useParams();
  let workingDir = useMemo(() => {
    if (!id) return '/';
    try {
      return atob(id);
    } catch (e) {
      if (e instanceof DOMException) {
        return '/';
      }
      throw e;
    }
  }, [id]);

  let history = useHistory();

  const move = (id: string) => {
    history.push('/' + btoa(id));
  };

  const [res] = useLsQuery({ variables: { dir: workingDir } });
  useDocTitle(res.data?.fileById?.name || 'Unknown folder');

  if (res.fetching || !res.data) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;

  let f = res.data.fileById;
  if (!isFolder(f)) return <p>Errored!</p>;

  return (
    <div className="container mx-auto h-full">
      <div className="p-4 h-full">
        <FileTable folder={f} onFolderDoubleClick={move} />
      </div>
    </div>
  );
}

export default FileManager;
