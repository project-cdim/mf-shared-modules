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

import { useState } from 'react';

import { useDisclosure } from '@mantine/hooks';
import { AxiosError } from 'axios';

/**
 * State used in ConfirmModal
 * @returns An object containing the following properties and functions:
 */
export const useConfirmModal = () => {
  const [isModalOpen, { open: setModalOpen, close: closeModal }] =
    useDisclosure(false);
  const [error, setError] = useState<
    AxiosError<{ code: string; message: string }> | undefined
  >(undefined);

  const openModal = () => {
    setError(undefined);
    setModalOpen();
  };

  return { openModal, closeModal, setError, isModalOpen, error };
};
