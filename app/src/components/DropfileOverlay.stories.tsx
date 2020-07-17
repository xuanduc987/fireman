import React from 'react';
import { DropfileOverlay } from './DropfileOverlay';

export default {
  title: 'DropfileOverlay',
  component: DropfileOverlay,
};

const Template = (args: {}) => <DropfileOverlay {...args} />;

export const Basic: any = Template.bind({});
Basic.args = {
};
