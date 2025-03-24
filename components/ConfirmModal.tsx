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

'use client';

import { Button, Group, Modal, Text, Title } from '@mantine/core';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';

import { MessageBox } from './MessageBox';

export type ConfirmModalProps = {
  /** Title */
  title: string;
  /** Subtitle */
  subTitle: string;
  /** Message */
  message: string;
  /** Error title */
  errorTitle: string | undefined;
  /** Modal open/close state */
  isModalOpen: boolean;
  /** close the modal */
  closeModal: () => void;
  /** Error */
  error: AxiosError<{ code: string; message: string }> | undefined;
  /** Processing when the OK button is pressed */
  submit: CallableFunction;
};

/**
 * A reusable component for displaying a confirmation modal.
 *
 * @component
 * @param props {@link ConfirmModalProps}
 * @returns The ConfirmModal component.
 */
export const ConfirmModal = ({
  title,
  subTitle,
  message,
  isModalOpen,
  closeModal,
  error,
  submit,
  errorTitle,
}: ConfirmModalProps) => {
  const t = useTranslations();

  return (
    <Modal
      opened={isModalOpen}
      onClose={closeModal}
      lockScroll={false}
      title={
        <Group>
          <Title order={3} fz='lg' fw={700}>
            {title}
          </Title>
          <Group gap={5} fz='sm' c='gray.7'>
            {subTitle}
          </Group>
        </Group>
      }
      size={550}
    >
      {error && (
        <MessageBox
          type='error'
          title={errorTitle ?? t('Error')}
          message={
            <>
              <Text>{error.message}</Text>
              {error.response && (
                <Text>
                  {error.response.data.message}({error.response.data.code})
                </Text>
              )}
            </>
          }
        />
      )}
      <Text py={5}>{message}</Text>
      <Group gap={10} justify='end' pt={10}>
        <Button variant='outline' color='dark' onClick={closeModal}>
          {t('No')}
        </Button>
        <Button
          onClick={() => {
            submit();
          }}
        >
          {t('Yes')}
          {/* {modalMode === 'delete' ? policyModalMode[modalMode] : 'OK'} */}
        </Button>
      </Group>
    </Modal>
  );
};
