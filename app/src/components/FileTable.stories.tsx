import React from 'react';

import type { FileInfo } from '../types';
import { FileTable, FileTableProps } from './FileTable';

export default {
  title: 'FileTable',
  component: FileTable,
};

let folder = (name: string, children: FileInfo[] = []) => ({
  __typename: 'Folder' as const,
  id: name,
  name,
  children,
});

let file = (name: string) => ({
  __typename: 'File' as const,
  id: name,
  name,
  size: Math.random() * 10_000_000,
});

let dummyFolder = folder('dummy', [
  file('1'),
  file('2'),
  file('3'),
  folder('4', []),
  folder('5', [file('6')]),
]);

const Template = (args: FileTableProps) => <FileTable {...args} />;

export const Basic: { args: FileTableProps } = Template.bind({}) as any;
Basic.args = {
  folder: dummyFolder
};
