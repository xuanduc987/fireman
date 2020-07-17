import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDropzone } from 'react-dropzone';
import { useParams, useHistory } from 'react-router-dom';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import SVG from 'react-inlinesvg';
import pencil from 'heroicons/solid/pencil.svg';
import trash from 'heroicons/solid/trash.svg';

import { CreateFolderModal } from './components/CreateFolderModal';
import { DropfileOverlay } from './components/DropfileOverlay';
import {
  useCreateFolderMutation,
  useListQuery,
  useRemoveFilesMutation,
  useRenameMutation,
  useUploadMutation,
} from './generated/graphql';
import { FileInfo, FileT, isFolder } from './types';
import { FileTable } from './components/FileTable';
import { RenameModal } from './components/RenameModal';
import { Toolbar } from './components/Toolbar';
import { useDocTitle } from './hooks';
import { SERVER_URL } from './constants';

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

  let openFile = (file: FileT) => {
    window.open(SERVER_URL + file.url);
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
    [uploading, workingDir],
  );

  useEffect(() => {
    console.table(uploading);
  }, [uploading]);

  let inputFileRef = useRef<HTMLInputElement | null>(null);

  let [selected, setSelected] = useState<FileInfo | null>(null);

  let { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  let [newFolderModalOpen, setNewfolderModalOpen] = useState(false);

  let [, createFolder] = useCreateFolderMutation();
  let [, removeFiles] = useRemoveFilesMutation();
  let [, renameFile] = useRenameMutation();

  let remove = (id: string) => {
    removeFiles(
      {
        input: {
          fileIds: [id],
        },
      },
      { additionalTypenames: ['File', 'Folder'] },
    ).finally(() => {
      setSelected(null);
      execList();
    });
  };

  let [oldName, setOldname] = useState('');
  let [renameModalOpen, setRenameModalOpen] = useState(false);

  let rename = (file: FileInfo, name: string) => {
    if (name == file.name) return;
    renameFile(
      {
        input: {
          fileId: file.id,
          name,
        },
      },
      { additionalTypenames: ['File', 'Folder'] },
    ).finally(() => {
      setSelected(null);
      execList();
    });
  };

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
          buttons={
            selected
              ? ['rename', 'del', 'addFolder', 'addFiles']
              : ['addFolder', 'addFiles']
          }
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
            if (type === 'del') {
              if (!selected) return;
              remove(selected.id);
            }
            if (type === 'rename') {
              if (!selected) return;
              if (!isFolder(f)) return;
              setOldname(selected.name);
              setRenameModalOpen(true);
            }
          }}
        />

        <div className="w-full flex-1 min-h-0 overflow-y-scroll relative">
          <FileTable
            className="border-t-0"
            folder={f}
            onFolderDoubleClick={({ id }) => move(id)}
            onFileDoubleClick={(file) => openFile(file)}
            onFileClick={(f) => {
              setSelected((selected) =>
                selected && selected.id === f.id ? null : f,
              );
            }}
            selected={selected}
            contextMenuId="file-context-menu"
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

      <RenameModal
        isOpen={renameModalOpen}
        name={oldName}
        onRequestClose={() => setRenameModalOpen(false)}
        onRename={(name) => {
          if (!selected) return;
          rename(selected, name);
        }}
      />

      <ContextMenu
        id="file-context-menu"
        onShow={(e) => {
          setSelected(e.detail.data.file);
        }}
      >
        <MenuItem
          onClick={(_, prop: { file: FileInfo }) => {
            setOldname(prop.file.name);
            setRenameModalOpen(true);
          }}
        >
          <SVG src={pencil} className="inline-block h-4 mr-2" />
          <span>Rename</span>
        </MenuItem>

        <MenuItem
          onClick={(_, prop: { file: { id: string } }) => {
            remove(prop.file.id);
          }}
        >
          <SVG src={trash} className="inline-block h-4 mr-2" />
          <span>Delete</span>
        </MenuItem>
      </ContextMenu>
    </div>
  );
}

export default FileManager;
