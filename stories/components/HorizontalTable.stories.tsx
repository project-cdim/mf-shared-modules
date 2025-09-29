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
import { HorizontalTable } from '@/shared-modules/components';

type Story = StoryObj<typeof HorizontalTable>;

const meta: Meta<typeof HorizontalTable> = {
  title: 'Shared-Modules/components/HorizontalTable',
  component: HorizontalTable,
};

export default meta;

export const Demo: Story = {
  args: {
    title: 'Title',
    tableData: [
      { columnName: 'Column 1', value: 'Value 1' },
      { columnName: 'Column 2', value: 'Value 2' },
      { columnName: 'Column 3', value: 'Value 3' },
    ],
    loading: false,
  },
};
