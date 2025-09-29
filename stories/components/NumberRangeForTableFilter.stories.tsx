import type { Meta, StoryObj } from '@storybook/react';
import { NumberRangeForTableFilter } from '@/shared-modules/components/TableFilters';

type StoryNumberRange = StoryObj<typeof NumberRangeForTableFilter>;
const metaNumberRange: Meta<typeof NumberRangeForTableFilter> = {
  title: 'shared-modules/components/NumberRangeForTableFilter',
  component: NumberRangeForTableFilter,
};
export default metaNumberRange;

export const DemoNumberRange: StoryNumberRange = {
  // args: { values: [1, 10] },
  args: { values: [undefined, undefined] },
};
