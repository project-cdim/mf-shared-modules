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
import { IconWithInfo } from '../../components/IconWithInfo';
import { Fragment } from 'react';
import { Table } from '@mantine/core';

type Story = StoryObj<typeof IconWithInfo>;

const meta: Meta<typeof IconWithInfo> = {
  title: 'Shared-Modules/components/IconWithInfo',
  component: IconWithInfo,
  argTypes: {
    label: {
      type: 'string',
    },
    type: {
      options: [
        'check',
        'info',
        'warning',
        'critical',
        'ban',
        'disabled',
        'in_progress',
        'canceling',
        'canceled',
        'suspended',
        'skipped',
      ],
      control: { type: 'select' },
    },
    size: { control: { type: 'number', min: 1, max: 30, step: 1 } },
  },
};

export default meta;

export const Demo: Story = {
  args: { type: 'check', label: 'It works' },
  render: (args) => {
    // const labels: { [key: string]: string } = {
    //   check: 'Check',
    //   info: 'Info',
    //   warning: 'Warning',
    //   critical: 'Critical',
    //   ban: 'Ban',
    //   disabled: 'Disabled',
    //   in_progress: 'In Progress',
    //   canceling: 'Canceling',
    //   canceled: 'Canceled',
    //   suspended: 'Suspended',
    //   skipped: 'Skipped',
    // };
    return <IconWithInfo {...args} />;
  },
};

export const List: Story = {
  render: () => {
    const head = [
      '',
      'check',
      'info',
      'warning',
      'critical',
      'ban',
      'disabled',
      'in_progress',
      'canceling',
      'canceled',
      'suspended',
      'skipped',
    ] as const satisfies string[];
    const sizes = [10, 20, 30, 40];
    const body = sizes.map((size) =>
      head.map((type) =>
        type === '' ? (
          <Fragment key={`size-${size}`}>{size.toString()}</Fragment>
        ) : (
          <IconWithInfo type={type} size={size} key={`${type}-${size}`} label={`type:${type}, size:${size}`} />
        )
      )
    );
    return <Table data={{ head, body }} />;
  },
};
