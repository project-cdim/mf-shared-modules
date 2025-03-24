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

import React, { ReactNode } from 'react';

import { Alert } from '@mantine/core';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';

type Props = {
  /** Title */
  title: string;
  /** Message */
  message: string | ReactNode;
  /** Type for color separation */
  type: 'success' | 'error';
  /** Callback function when the close button is pressed */
  close?: CallableFunction;
};

/**
 * Component to display a message box
 *
 * @component
 * @param props {@link Props}
 * @returns Message box JSX.Element
 */
export const MessageBox = ({ title, message, type, close }: Props) => {
  const colors = {
    success: 'blue',
    error: 'red',
  };

  return (
    <Alert
      icon={
        type === 'success' ? (
          <IconInfoCircle size='1rem' />
        ) : (
          <IconAlertCircle size='1rem' />
        )
      }
      title={title}
      color={colors[type]}
      withCloseButton={type === 'success'}
      onClose={() => {
        if (close) {
          close();
        }
      }}
    >
      {message}
    </Alert>
  );
};
