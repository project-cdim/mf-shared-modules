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

import { ReactNode, useEffect } from 'react';

import axios from 'axios';
import { type Middleware, SWRConfig } from 'swr';

import { useLuigiClient } from '../utils/hooks';

/**
 * Set the access token in the axios request headers when NEXT_PUBLIC_GRANT_TOKEN is not false.
 * Requests would not be executed when the token is not ready.
 * @param props {@link Props}
 * @returns The rendered layout component.
 */
export const TokenInjector = ({ children }: { children: ReactNode }) => {
  const grantToken = process.env.NEXT_PUBLIC_GRANT_TOKEN !== 'false';
  useEffect(() => {
    // `require` is faster than `useLuigiClient`, so `useLuigiClient` is not used here
    const luigiClient: (typeof window)['LuigiClient'] = require('@luigi-project/client');
    luigiClient.addInitListener(() => {
      axios.interceptors.request.use((config) => {
        // Processing before the request is sent
        const token = luigiClient.getToken(); // Always get the latest token
        if (
          // Do not grant if the Authorization header exists.(including 'Authorization: undefined')
          !Object.hasOwn(config.headers, 'Authorization') &&
          token &&
          grantToken
        ) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      });
    });
  }, [grantToken]);
  return grantToken ? <SWRConfig value={{ use: [skipRequestWhenNoToken] }}>{children}</SWRConfig> : <>{children}</>;
};

const skipRequestWhenNoToken: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const luigiClient = useLuigiClient();
    return useSWRNext(luigiClient?.getToken() ? key : null, fetcher, config);
  };
};
