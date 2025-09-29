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
