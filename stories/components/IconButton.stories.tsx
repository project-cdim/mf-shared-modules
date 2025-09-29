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

import { ActionIcon, Button, Group, Stack } from '@mantine/core';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';

type Story = StoryObj<typeof Button>;

/** Individual components are not created; Mantine's components are used as-is */
const meta: Meta<typeof Button> = {
  title: 'Mantine/IconButton',
  component: ActionIcon,
  args: {
    size: 30,
    title: 'title',
    variant: 'outline',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'light', 'filled'],
    },
    color: {
      control: { type: 'select' },
      options: ['blue', 'dark', 'red'],
      // defaultValue: 'blue',
    },
  },
};

export default meta;

export const Defalut: Story = {
  args: {
    children: <IconPencil />,
  },
};

export const List: Story = {
  render: () => {
    return (
      <Stack>
        <Group gap='xs'>
          <ActionIcon variant='outline' color='blue.6' size={30} title='Edit'>
            <IconPlus />
          </ActionIcon>
          <ActionIcon variant='outline' color='blue.6' size={30} title='Edit'>
            <IconPencil />
          </ActionIcon>
          <ActionIcon variant='outline' color='red.6' size={30} title='Delete'>
            <IconTrash />
          </ActionIcon>
        </Group>
        <Group gap='xs'>
          <ActionIcon disabled={true} size={30} title='Edit'>
            <IconPlus />
          </ActionIcon>
          <ActionIcon disabled={true} size={30} title='Edit'>
            <IconPencil />
          </ActionIcon>
          <ActionIcon disabled={true} size={30} title='Delete'>
            <IconTrash />
          </ActionIcon>
        </Group>
      </Stack>
    );
  },
};

// <Button
// size='xs'
// variant='outline'
// color='dark'
// onClick={() => {
//   disablePolicy(policy.policyID);
// }}
// disabled={!hasPermission}
// >
// <Text size={'sm'} fw={700}>
//   {t('Disable')}
// </Text>
// </Button>
// <Divider orientation='vertical' />
// <ActionIcon disabled={true} size={30} title={t('Edit')}>
// <IconPencil />
// </ActionIcon>
// <ActionIcon disabled={true} size={30} title={t('Delete')}>
// <IconTrash />
// </ActionIcon>
