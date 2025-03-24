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

import { useRouter } from 'next/navigation';

/**
 * Custom hook that returns the query parameters from the current URL.
 * If Luigi client is available, it uses the query parameters from Luigi.
 * Otherwise, it uses the query parameters from the router.
 * luigi query is returned asynchronously.
 * @returns {NodeJS.Dict<string | string[]>} The query parameters as a dictionary.
 */
export const useQuery = (): NodeJS.Dict<string | string[]> => {
  const router: any = useRouter();
  const [query, setQuery] = useState({});
  const [luigiClient, setLuigiClient] = useState<(typeof window)['LuigiClient'] | null>(null);
  useEffect(() => {
    const client = require('@luigi-project/client');
    client.addInitListener(() => {
      /** Use the query of luigiClient */
      setLuigiClient(client);
      setQuery(client.getNodeParams());
    });
  }, []);
  useEffect(() => {
    if (!luigiClient && router.isReady) {
      /** If there is no luigiClient, use the router query */
      setQuery(router.query);
    }
  }, [luigiClient, router.isReady, router.query]);
  return query;
};
