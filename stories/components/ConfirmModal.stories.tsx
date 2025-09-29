import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmModal } from '@/shared-modules/components/ConfirmModal';
import { AxiosError } from 'axios';
import { useState } from 'react';

type Story = StoryObj<typeof ConfirmModal>;

const propsDUMMY = {
  title: 'Title',
  subTitle: 'subTitle',
  message: 'message message message',
  errorTitle: undefined,
  isModalOpen: true,
  closeModal: () => {
    alert('close');
  },
  error: undefined,
  submit: () => {
    alert('submit');
  },
};

// ANCHOR  Meta
const meta = {
  tags: ['autodocs'],
  title: 'Shared-Modules/components/ComfirmModal',
  component: ConfirmModal,
  args: { ...propsDUMMY },
} satisfies Meta<typeof ConfirmModal>;

export default meta;

export const Primary: Story = {
  render: function Component() {
    const [openModal, setOpenModal] = useState(false);
    const props = {
      ...propsDUMMY,
      isModalOpen: openModal,
      closeModal: () => {
        setOpenModal(false);
      },
    };
    return (
      <>
        <button
          onClick={() => {
            setOpenModal(true);
          }}
        >
          open
        </button>
        <ConfirmModal {...props} />
      </>
    );
  },
};

export const WithErroe: Story = {
  render: function Component() {
    const [openModal, setOpenModal] = useState(false);
    const props = {
      ...propsDUMMY,
      error: new AxiosError<{ code: string; message: string }>('error message'),
      isModalOpen: openModal,
      closeModal: () => {
        setOpenModal(false);
      },
    };
    return (
      <>
        <button
          onClick={() => {
            setOpenModal(true);
          }}
        >
          open
        </button>
        <ConfirmModal {...props} />
      </>
    );
  },
};
