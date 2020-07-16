import * as React from 'react';

import { noop } from '../utils';

export type ModalProps = {
  children?: React.ReactNode;
  onRequestClose?: () => void;
};

export function Modal(props: ModalProps) {
  let { children, onRequestClose = noop } = props;
  return (
    <div className="fixed inset-0 p-4 flex items-center justify-center">
      <div className="fixed inset-0" onClick={onRequestClose}>
        <div className="absolute inset-0 bg-gray-500 opacity-75" />
      </div>
      <div
        className="bg-white rounded-lg overflow-hidden shadow-lg transform max-w-lg w-full"
        role="dialog"
      >
        {children}
      </div>
    </div>
  );
}

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function ModalContent(props: ContainerProps) {
  let { className = '', ...rest } = props;
  return <div {...rest} className={'bg-white px-6 py-4 ' + className} />;
}

export function ModalFooter(props: ContainerProps) {
  let { className = '', ...rest } = props;
  return (
    <div
      {...rest}
      className={
        'bg-gray-100 px-6 py-3 sm:flex sm:flex-row-reverse ' + className
      }
    />
  );
}
