import React from 'react';

import { Modal, ModalContent, ModalFooter, ModalProps } from './Modal';

export default {
  title: 'Modal',
  component: Modal,
};

const Template = (args: ModalProps) => <Modal {...args} />;

export const Basic: any = Template.bind({});
Basic.args = {
  children: <ModalContent>Hello</ModalContent>,
};

export const Test: any = Template.bind({});
Test.args = {
  children: (
    <>
      <ModalContent>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
          id="modal-headline"
        >
          Deactivate account
        </h3>
        <div className="mt-2">
          <p className="text-sm leading-5 text-gray-500">
            Are you sure you want to deactivate your account? All of your data
            will be permanently removed. This action cannot be undone.
          </p>
        </div>
      </ModalContent>
      <ModalFooter>
        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red sm:text-sm sm:leading-5"
          >
            Deactivate
          </button>
        </span>
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5"
          >
            Cancel
          </button>
        </span>
      </ModalFooter>
    </>
  ),
};

export const Input: any = Template.bind({});
Input.args = {
  children: (
    <>
      <ModalContent>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
        >
          Please input new folder name
        </h3>
        <div className="mt-2">
          <input autoFocus className="shadow appearance-none border rounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"/>
        </div>
      </ModalContent>
      <ModalFooter>
        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue sm:text-sm sm:leading-5"
          >
            Create
          </button>
        </span>
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5"
          >
            Cancel
          </button>
        </span>
      </ModalFooter>
    </>
  ),
};
