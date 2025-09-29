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
