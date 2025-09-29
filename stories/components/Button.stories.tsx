import type { Meta, StoryObj } from '@storybook/react';

import { Button, Card, Divider, Group, Stack, Table } from '@mantine/core';
import { IconReload } from '@tabler/icons-react';

type Story = StoryObj<typeof Button>;

/** Individual components are not created; Mantine's components are used as-is */
const meta: Meta<typeof Button> = {
  title: 'Mantine/Button',
  component: Button,
  args: {
    children: 'Button',
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
    size: { control: { type: 'select' }, options: ['xs', 'sm'], defaultValue: 'sm' },
  },
};

export default meta;

export const Defalut: Story = {
  args: {
    children: 'Default Button',
  },
};

export const Reload: Story = {
  render: () => {
    const props = {
      children: 'Reload',
      radius: 'xl',
      variant: 'light',
      leftSection: <IconReload />,
      loading: true,
      loaderProps: { type: 'dots' },
    };
    const head = ['loading', 'loaded'] as const satisfies string[];
    const body = [[<Button {...props} key='loading' />], [<Button {...props} loading={false} key='loaded' />]];

    return (
      <Table variant='vertical'>
        <Table.Tbody>
          {head.map((th, index) => (
            <Table.Tr key={th}>
              <Table.Th key={`head-${index}`}>{th}</Table.Th>
              <Table.Td key={`body-${index}`}>
                <Group>{body[index]}</Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  },
};

export const DemoOnPage: Story = {
  args: {
    size: 'xs',
  },
  render: (args) => (
    <Stack>
      <Group gap='xs'>
        <Button {...args} variant='outline' color='dark'>
          Edit
        </Button>
        <Button {...args} variant='outline' color='dark'>
          Cancel
        </Button>
        <Button {...args} variant='outline' color='dark'>
          Add Tile
        </Button>
        <Button {...args} variant='outline' color='dark'>
          Enable
        </Button>
        <Button {...args} variant='outline' color='dark'>
          Disable
        </Button>
      </Group>
      <Group gap='xs'>
        <Button {...args}>Save</Button>
      </Group>
      <Group gap='xs'>
        <Button {...args} color='red'>
          Delete
        </Button>
        <Button {...args} color='red'>
          Cancel
        </Button>
      </Group>
      <Group gap='xs'>
        <Button {...args} disabled={true}>
          Import
        </Button>
      </Group>
      <Group gap='xs' bg={`rgb(240, 240, 240)`} p='xs' w='fit-content'>
        <Button {...args}>Save</Button>
        <Button {...args} variant='outline' color='dark' bg='white'>
          Cancel
        </Button>
        <Divider orientation='vertical' />
        <Button {...args} variant='outline' color='dark' bg='white'>
          Add
        </Button>
      </Group>
    </Stack>
  ),
};

export const DemoOnDialog: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => (
    <Stack>
      <Card withBorder w={350}>
        <p>OK?</p>
        <Group justify='flex-end' gap='xs'>
          <Button {...args} variant='outline' color='dark'>
            Cancel
          </Button>
          <Button {...args}>OK</Button>
        </Group>
      </Card>
      <Card withBorder w={350}>
        <p>Delete?</p>
        <Group justify='flex-end' gap='xs'>
          <Button {...args} variant='outline' color='dark'>
            Cancel
          </Button>
          <Button {...args} color='red'>
            OK
          </Button>
        </Group>
      </Card>
    </Stack>
  ),
};
