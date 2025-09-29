import type { Meta, StoryObj } from '@storybook/react';
import { HorizontalTable } from '@/shared-modules/components';

type Story = StoryObj<typeof HorizontalTable>;

const meta: Meta<typeof HorizontalTable> = {
  title: 'Shared-Modules/components/HorizontalTable',
  component: HorizontalTable,
};

export default meta;

export const Demo: Story = {
  args: {
    title: 'Title',
    tableData: [
      { columnName: 'Column 1', value: 'Value 1' },
      { columnName: 'Column 2', value: 'Value 2' },
      { columnName: 'Column 3', value: 'Value 3' },
    ],
    loading: false,
  },
};
