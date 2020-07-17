import React from 'react';
import { Toolbar, ToolbarProps } from './Toolbar';

export default {
  title: 'Toolbar',
  component: Toolbar,
};

const Template = (args: ToolbarProps) => <Toolbar {...args} />;

export const Basic: any = Template.bind({});
Basic.args = {
  buttons: ['del', 'addFolder'],
  breadCrumbItems: [
    { key: '1', name: 'home' },
    { key: '2', name: 'xyz' },
    { key: '3', name: 'abc' },
  ]
};
