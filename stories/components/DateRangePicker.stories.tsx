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
