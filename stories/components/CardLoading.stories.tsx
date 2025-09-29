import type { Meta, StoryObj } from '@storybook/react';

import { CardLoading } from '@/shared-modules/components';
import { CardProps } from '@mantine/core';

type Story = StoryObj<typeof CardLoading>;

const meta: Meta<typeof CardLoading> = {
  title: 'Shared-Modules/components/CardLoading',
  component: CardLoading,
};

export default meta;

const dummyCardProps = {
  withBorder: true,
  w: 200,
  children: <p>DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT</p>,
} as const satisfies CardProps;

export const Demo: Story = {
  args: {
    ...dummyCardProps,
    loading: true,
  },
};
