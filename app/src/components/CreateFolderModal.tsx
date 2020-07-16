import { Portal } from 'react-portal';
import React, { useRef } from 'react';

import { Modal, ModalContent, ModalFooter } from './Modal';
import { noop } from '../utils';

type CreateFolderModalProps = {
  isOpen?: boolean;
  onCreate?: (name: string) => void;
  onRequestClose?: () => void;
};

export function CreateFolderModal(props: CreateFolderModalProps) {
  let { isOpen = false, onCreate = noop, onRequestClose = noop } = props;

  let ref = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {isOpen && (
        <Portal>
          <Modal onRequestClose={onRequestClose}>
            <form
              action="#"
              onSubmit={(e) => {
                e.preventDefault()
                if (!ref.current?.value.trim()) return;
                onCreate(ref.current.value.trim());
                onRequestClose();
              }}
            >
              <ModalContent>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Please input new folder name
                </h3>
                <div className="mt-2">
                  <input
                    ref={ref}
                    autoFocus
                    className="shadow appearance-none border rounded w-full py-2 px-3
              text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                  />
                </div>
              </ModalContent>
              <ModalFooter>
                <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue sm:text-sm sm:leading-5"
                  >
                    Create
                  </button>
                </span>
                <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5"
                    onClick={onRequestClose}
                  >
                    Cancel
                  </button>
                </span>
              </ModalFooter>
            </form>
          </Modal>
        </Portal>
      )}
    </>
  );
}
