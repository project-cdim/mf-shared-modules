import type { Meta, StoryObj } from '@storybook/react';
import { NoData } from '@/shared-modules/components';

type Story = StoryObj<typeof NoData>;

const meta: Meta<typeof NoData> = {
  title: 'Shared-Modules/components/NoData',
  component: NoData,
};

export default meta;

export const Demo: Story = {
  args: {
    isNoData: true,
    children: <p style={{ textAlign: `center` }}>Data XXXXXX</p>,
  },
  render: (args) => <NoData {...args} />,
};
