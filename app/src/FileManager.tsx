import { useDropzone } from 'react-dropzone';
import { useParams, useHistory } from 'react-router-dom';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';

import { CreateFolderModal } from './components/CreateFolderModal';
import { DropfileOverlay } from './components/DropfileOverlay';
import { FileTable } from './components/FileTable';
import { Toolbar } from './components/Toolbar';
import { isFolder } from './types';
import { useDocTitle } from './hooks';
import {
  useListQuery,
  useUploadMutation,
  useCreateFolderMutation,
} from './generated/graphql';

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

  let inputFileRef = useRef<HTMLInputElement | null>(null);

  let { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  let [newFolderModalOpen, setNewfolderModalOpen] = useState(false);

  let [, createFolder] = useCreateFolderMutation();

  if (list.fetching || !list.data) return <p>Loading...</p>;
  if (list.error) return <p>Errored!</p>;

  let f = list.data.fileById;
  if (!isFolder(f)) return <p>Errored!</p>;

  return (
    <div {...getRootProps()} className="container mx-auto h-full">
      <div className="px-4 pt-4 h-full flex flex-col">
        <input
          hidden
          type="file"
          multiple
          ref={inputFileRef}
          onChange={() => {
            if (!inputFileRef.current) return;
            onDrop([...(inputFileRef.current.files || [])]);
          }}
        />
        <Toolbar
          buttons={['del', 'addFolder', 'addFiles']}
          breadCrumbItems={f.path
            .concat(f)
            .map((f) => ({ key: f.id, name: f.name }))}
          onBreadCrumbItemClick={move}
          onButtonClick={(type) => {
            if (type === 'addFolder') setNewfolderModalOpen(true);
            if (type === 'addFiles') {
              if (!inputFileRef.current) return;
              inputFileRef.current.click();
            }
          }}
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

      <CreateFolderModal
        isOpen={newFolderModalOpen}
        onRequestClose={() => setNewfolderModalOpen(false)}
        onCreate={(name) => {
          createFolder({
            input: {
              parent: workingDir,
              name,
            },
          }).finally(execList);
        }}
      />
    </div>
  );
}

export default FileManager;
