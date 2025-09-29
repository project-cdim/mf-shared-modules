import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelectForTableFilter } from '@/shared-modules/components/TableFilters';

type StoryMultiSelect = StoryObj<typeof MultiSelectForTableFilter>;

const metaMultiSelect: Meta<typeof MultiSelectForTableFilter> = {
  title: 'shared-modules/components/MultiSelectForTableFilter',
  component: MultiSelectForTableFilter,
};
export default metaMultiSelect;

export const DemoMultiSelect: StoryMultiSelect = {
  args: {
    label: 'Label',
    options: [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
      { value: '3', label: 'Three' },
    ],
    // value: ['1'],
    setValue(p) {
      console.log(p);
    },
  },
};
