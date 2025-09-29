import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../../components/Icon';
import { Table } from '@mantine/core';

type Story = StoryObj<typeof Icon>;

const meta: Meta<typeof Icon> = {
  title: 'Shared-Modules/components/Icon',
  component: Icon,
  args: {},
  argTypes: {
    status: {
      options: [
        'Critical',
        'Failed',
        'Warning',
        'Suspended',
        'OK',
        'Disabled',
        'Available',
        'Unavailable',
        'Unallocated',
        'All',
        undefined,
      ],
      control: { type: 'select' },
    },
    size: { control: { type: 'number', min: 1, max: 30, step: 1 } },
  },
  // render
};

export default meta;

export const Demo: Story = {
  args: {
    status: 'OK',
  },
};

export const List: Story = {
  render: () => {
    const head = [
      'Critical',
      'Failed',
      'Warning',
      'Suspended',
      'OK',
      'Disabled',
      'Available',
      'Unavailable',
      'All',
      undefined,
    ] as const;
    const body = [head.map((status) => <Icon status={status} key={status || 'undefined'} />)];
    return <Table data={{ head: head.map((label) => label ?? 'undefined'), body }} />;
  },
};
