import type { Meta, StoryObj } from '@storybook/react';
import { Multiline } from '@/shared-modules/components';

type Story = StoryObj<typeof Multiline>;

const meta: Meta<typeof Multiline> = {
  title: 'Shared-Modules/components/Multiline',
  component: Multiline,
};

export default meta;

export const Demo: Story = {
  args: {
    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.\nIllo, possimus veritatis odit commodi temporibus impedit?\nSequi iste fuga quis voluptas nisi blanditiis!\nSit inventore ea, et amet aspernatur ipsa cupiditate?',
  },
  render: (args) => <Multiline {...args} />,
};
