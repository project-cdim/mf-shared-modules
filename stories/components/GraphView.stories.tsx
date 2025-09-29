import type { Meta, StoryObj } from '@storybook/react';

const P = () => <p></p>;

type Story = StoryObj<typeof P>;

const meta: Meta<typeof P> = {
  title: 'Shared-Modules/components/GraphView',
  component: P,
};

export default meta;

export const Demo: Story = {
  args: {},
  render: () => <P />,
};
