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

import { LOADING_DURATION } from '@/shared-modules/constant';

/**
 * Custom hook that returns the loading state
 *
 * @param isValidating Flag indicating validation
 * @returns Boolean indicating whether it is in loading
 */
export const useLoading = (isValidating: boolean) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isValidating) {
      setLoading(true);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, LOADING_DURATION);
    }
  }, [isValidating]);

  return loading;
};
