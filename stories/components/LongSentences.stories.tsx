import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@mantine/core';
import { LongSentences } from '../../components';

/* 
This component demonstrates the usage of the LongSentences component.
It supports truncating text with ellipsis and limiting the number of visible lines.
*/
const meta: Meta = {
  title: 'shared-modules/Components/LongSentences',
  component: LongSentences,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    (Story) => (
      <Card w={400} withBorder={true}>
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof LongSentences>;

export default meta;

type Story = StoryObj<typeof LongSentences>;

export const OneLineTruncated: Story = {
  args: {
    text: 'This is a very long sentence that should be truncated. This is a very long sentence that should be truncated.',
    lines: 1,
    truncate: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A single line of text that is truncated with ellipsis if it overflows.',
      },
    },
  },
};

export const OneLineNotTruncated: Story = {
  args: {
    text: 'This is a very long sentence that should not be truncated. This is a very long sentence that should not be truncated.',
    lines: 1,
    truncate: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A single line of text that is not truncated, even if it overflows.',
      },
    },
  },
};

export const ThreeLinesTruncated: Story = {
  args: {
    text: 'This is a very long sentence that spans multiple lines and should be truncated after three lines. '.repeat(
      4
    ),
    lines: 3,
    truncate: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Up to three lines of text that are truncated with ellipsis if they overflow.',
      },
    },
  },
};

export const ThreeLinesNotTruncated: Story = {
  args: {
    text: 'This is a very long sentence that spans multiple lines and should not be truncated. '.repeat(4),
    lines: 3,
    truncate: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Up to three lines of text that are not truncated, even if they overflow.',
      },
    },
  },
};
