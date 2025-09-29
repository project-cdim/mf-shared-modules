import type { Meta, StoryObj } from '@storybook/react';

import { DateRangePicker } from '@/shared-modules/components';
import { DateRange } from '@/shared-modules/types';

type Story = StoryObj<typeof DateRangePicker>;

const meta: Meta<typeof DateRangePicker> = {
  title: 'Shared-Modules/components/DateRangePicker',
  component: DateRangePicker,
};

export default meta;

const setValue = () => undefined;
const dates: DateRange = [new Date('2020/1/1'), new Date('2024/1/1')];
export const Demo: Story = {
  args: { value: dates, setValue: setValue, close: () => undefined },
};
