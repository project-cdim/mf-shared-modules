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

import { useEffect, useState } from 'react';

import { initMSW } from '@/shared-modules/utils/mocks';

/**
 * Custom hook to use Mock Service Worker(MSW)
 * Since requests are not mocked during initialization, control the return value so that API requests are not sent
 *
 * @returns Boolean indicating whether MSW is initializing
 */
export const useMSW = () => {
  const [isMswInitializing, setIsMswInitializing] = useState(true);

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_USE_MSW === 'true'
    ) {
      /**
       * Use MSW only in development environment or when environment variables are set
       * Set the flag when initialized in the callback
       */
      initMSW(() => setIsMswInitializing(false));
    } else {
      setIsMswInitializing(false);
    }
  }, []);

  return isMswInitializing;
};
