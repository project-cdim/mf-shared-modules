import type { Meta, StoryObj } from '@storybook/react';
import { TextInputForTableFilter } from '@/shared-modules/components/TableFilters';

type StoryTextInput = StoryObj<typeof TextInputForTableFilter>;

const metaTextInput: Meta<typeof TextInputForTableFilter> = {
  title: 'Shared-Modules/components/TextInputForTableFilter',
  component: TextInputForTableFilter,
  argTypes: {
    label: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
  },
};
export default metaTextInput;

export const DemoTextInput: StoryTextInput = {
  args: { label: 'Label', value: 'Value' },
};
