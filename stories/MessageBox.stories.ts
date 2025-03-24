/*
 * Copyright 2025 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { MessageBox } from '@/shared-modules/components';

/** More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export */
const meta = {
  title: 'Components/MessageBox',
  component: MessageBox,
  parameters: {
    /** Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout */
    layout: 'centered',
  },
  /** This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs */
  tags: ['autodocs'],
  /** More on argTypes: https://storybook.js.org/docs/react/api/argtypes */
  argTypes: {
    type: { control: 'select', options: ['error', 'warning', 'infomation'] },
  },
} satisfies Meta<typeof MessageBox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args */
export const Standard: Story = {
  args: {
    /** Title */
    title: 'Title',
    /** Message */
    message: 'Message',
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'error',
  },
};

export const EmptyTitle: Story = {
  args: {
    /** Title */
    title: '',
    /** Message */
    message: 'Message',
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'error',
  },
};

export const EmptyMessage: Story = {
  args: {
    /** Title */
    title: 'Title',
    /** Message */
    message: '',
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'error',
  },
};
