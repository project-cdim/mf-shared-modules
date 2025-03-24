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

/**
 * Custom hook that provides access to the Luigi client.
 * @returns The Luigi client object.
 */
export const useLuigiClient = () => {
  const [luigiClient, setLuigiClient] = useState<(typeof window)['LuigiClient'] | null>(null);
  useEffect(() => {
    // Need to use require here because the Luigi client is not available during SSR.
    const client = require('@luigi-project/client');
    client.addInitListener(() => {
      setLuigiClient(client);
    });
  }, []);
  return luigiClient;
};
