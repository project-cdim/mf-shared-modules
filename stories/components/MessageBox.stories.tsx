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

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const meta = {
  title: 'Shared-Modules/components/MessageBox',
  component: MessageBox,

  parameters: {
    /** Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout */
    layout: 'centered',
  },
  /** More on argTypes: https://storybook.js.org/docs/react/api/argtypes */
  argTypes: {
    type: { control: 'select', options: ['error', 'success'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Title',
    message: 'Message text',
    close: () => {
      alert('close');
    },
  },
} satisfies Meta<typeof MessageBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Error: Story = {
  args: {
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'error',
  },
};

export const ErrorWithOnlyTitle: Story = {
  args: {
    /** Message */
    message: '',
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'error',
  },
};

export const ErrorWithOnlyMessage: Story = {
  args: {
    /** Title */
    title: '',
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'error',
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Success: Story = {
  args: {
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'success',
  },
};

export const SuccessWithOnlyTitle: Story = {
  args: {
    /** Message */
    message: '',
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'success',
  },
};

export const SuccessWithOnlyMessage: Story = {
  args: {
    /** Title */
    title: '',
    /** Types for color coding (fixed values in 2023_1Q_Iter1) */
    type: 'success',
  },
};
