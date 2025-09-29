import type { Meta, StoryObj } from '@storybook/react';

import { DatetimeString } from '@/shared-modules/components';

export default {
  title: 'Shared-Modules/components/DatetimeString',
  component: DatetimeString,
} satisfies Meta<typeof DatetimeString>;

type Story = StoryObj<typeof DatetimeString>;

export const Default: Story = {
  args: { date: new Date() },
};
export const NoDate: Story = {
  args: { date: undefined },
};
