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

import { ReactNode } from 'react';

import '@mantine/charts/styles.css';
import { Box } from '@mantine/core';

import { useLuigiClient } from '../utils/hooks';
import { ReloadHeaderProviderAndConfig, TokenInjector } from './';

type Props = {
  children: ReactNode;
};

/**
 * Renders a layout component that wraps its children with a Box component and a {@link ReloadHeaderProviderAndConfig}.
 *
 * @param props {@link Props}
 * @returns The rendered layout component.
 */
export const Layout = ({ children }: Props) => {
  // Must useLuigiClient to communicate with Luigi
  useLuigiClient();
  return (
    <Box p='24px' h='100%'>
      <TokenInjector>
        <ReloadHeaderProviderAndConfig>
          {children}
        </ReloadHeaderProviderAndConfig>
      </TokenInjector>
    </Box>
  );
};
