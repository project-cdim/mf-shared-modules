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
import { Multiline } from '@/shared-modules/components';

type Story = StoryObj<typeof Multiline>;

const meta: Meta<typeof Multiline> = {
  title: 'Shared-Modules/components/Multiline',
  component: Multiline,
};

export default meta;

export const Demo: Story = {
  args: {
    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.\nIllo, possimus veritatis odit commodi temporibus impedit?\nSequi iste fuga quis voluptas nisi blanditiis!\nSit inventore ea, et amet aspernatur ipsa cupiditate?',
  },
  render: (args) => <Multiline {...args} />,
};
