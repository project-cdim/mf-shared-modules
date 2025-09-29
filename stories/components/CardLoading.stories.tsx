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

import { CardLoading } from '@/shared-modules/components';
import { CardProps } from '@mantine/core';

type Story = StoryObj<typeof CardLoading>;

const meta: Meta<typeof CardLoading> = {
  title: 'Shared-Modules/components/CardLoading',
  component: CardLoading,
};

export default meta;

const dummyCardProps = {
  withBorder: true,
  w: 200,
  children: <p>DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT DUMMY TEXT</p>,
} as const satisfies CardProps;

export const Demo: Story = {
  args: {
    ...dummyCardProps,
    loading: true,
  },
};
