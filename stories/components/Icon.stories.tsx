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
import { Icon } from '../../components/Icon';
import { Table } from '@mantine/core';

type Story = StoryObj<typeof Icon>;

const meta: Meta<typeof Icon> = {
  title: 'Shared-Modules/components/Icon',
  component: Icon,
  args: {},
  argTypes: {
    status: {
      options: [
        'Critical',
        'Failed',
        'Warning',
        'Suspended',
        'OK',
        'Disabled',
        'Available',
        'Unavailable',
        'Unallocated',
        'All',
        undefined,
      ],
      control: { type: 'select' },
    },
    size: { control: { type: 'number', min: 1, max: 30, step: 1 } },
  },
  // render
};

export default meta;

export const Demo: Story = {
  args: {
    status: 'OK',
  },
};

export const List: Story = {
  render: () => {
    const head = [
      'Critical',
      'Failed',
      'Warning',
      'Suspended',
      'OK',
      'Disabled',
      'Available',
      'Unavailable',
      'All',
      undefined,
    ] as const;
    const body = [head.map((status) => <Icon status={status} key={status || 'undefined'} />)];
    return <Table data={{ head: head.map((label) => label ?? 'undefined'), body }} />;
  },
};
