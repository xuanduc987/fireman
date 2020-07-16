import { useDropzone } from 'react-dropzone';
import { useParams, useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DropfileOverlay } from './components/DropfileOverlay';
import { useListQuery, useUploadMutation } from './generated/graphql';
import { FileTable } from './components/FileTable';
import { isFolder } from './types';
import { useDocTitle } from './hooks';
import { Toolbar } from './components/Toolbar';

type UploadState = 'uploading' | 'fail' | 'done';

const mark = (files: { name: string }[], state: UploadState) =>
  files.reduce((acc: Record<string, UploadState>, f) => {
    acc[f.name] = state;
    return acc;
  }, {});

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

  let move = (id: string) => {
    if (id == '/') history.push('/');
    else history.push('/' + btoa(id));
  };

  let [list, execList] = useListQuery({ variables: { dir: workingDir } });
  useDocTitle(list.data?.fileById?.name || 'Unknown folder');

  let [, uploadFiles] = useUploadMutation();

  let [uploading, setUploading] = useState<Record<string, UploadState>>({});

  let onDrop = useCallback(
    (acceptedFiles: File[]) => {
      let toUploads = acceptedFiles.filter(
        (f) => uploading[f.name] != 'uploading',
      );
      if (!toUploads.length) return;

      setUploading({
        ...uploading,
        ...mark(toUploads, 'uploading'),
      });

      uploadFiles({
        input: {
          parent: workingDir,
          files: toUploads.map((f) => ({
            name: f.name,
            file: f,
          })),
        },
      })
        .then(({ data }) => {
          let errors: Array<{ name: string }> = [];
          let files: Array<{ name: string }> = [];
          if (!data) {
            errors = toUploads;
          } else {
            files = data.uploadFiles.files || [];
            errors = (data.uploadFiles.errors || []).map((f) => ({
              name: f.fileName,
            }));
          }
          setUploading((uploading) => ({
            ...uploading,
            ...mark(files, 'done'),
            ...mark(errors, 'fail'),
          }));
        })
        .finally(execList);
    },
    [uploading],
  );

  useEffect(() => {
    console.table(uploading);
  }, [uploading]);

  let { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  if (list.fetching || !list.data) return <p>Loading...</p>;
  if (list.error) return <p>Errored!</p>;

  let f = list.data.fileById;
  if (!isFolder(f)) return <p>Errored!</p>;

  return (
    <div {...getRootProps()} className="container mx-auto h-full">
      <div className="px-4 pt-4 h-full flex flex-col">
        <Toolbar
          buttons={['del', 'addFolder']}
          breadCrumbItems={f.path
            .concat(f)
            .map((f) => ({ key: f.id, name: f.name }))}
          onBreadCrumbItemClick={move}
        />

        <div className="w-full flex-1 min-h-0 overflow-y-scroll relative">
          <FileTable
            className="border-t-0"
            folder={f}
            onFolderDoubleClick={move}
          />
          {isDragActive && <DropfileOverlay />}
        </div>
      </div>
    </div>
  );
}

export default FileManager;
