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

import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import useSWR from 'swr';

import { render } from '@/shared-modules/__test__/test-utils';
import { TokenInjector } from '@/shared-modules/components';

jest.mock('axios');

describe('TokenInjector', () => {
  const luigiClient = require('@luigi-project/client');

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variable
    process.env.NEXT_PUBLIC_GRANT_TOKEN = '';
  });

  test('set the access token in the axios request headers when NEXT_PUBLIC_GRANT_TOKEN is not false', () => {
    const token = 'testTokenString';
    luigiClient.getToken = jest.fn().mockReturnValue(token);

    render(
      <TokenInjector>
        <div>Test Component</div>
      </TokenInjector>
    );

    expect(axios.interceptors.request.use).toHaveBeenCalled();
    const interceptor = (axios.interceptors.request.use as jest.Mock).mock.calls[0][0];
    const config = { headers: {} as Record<string, string> };
    interceptor(config);
    expect(config.headers['Authorization']).toBe(`Bearer ${token}`);
  });

  test('not set the access token in the axios request headers when NEXT_PUBLIC_GRANT_TOKEN is false', () => {
    process.env.NEXT_PUBLIC_GRANT_TOKEN = 'false';
    const token = 'testTokenString';
    luigiClient.getToken = jest.fn().mockReturnValue(token);

    render(
      <TokenInjector>
        <div>Test Component</div>
      </TokenInjector>
    );

    expect(axios.interceptors.request.use).toHaveBeenCalled();
    const interceptor = (axios.interceptors.request.use as jest.Mock).mock.calls[0][0];
    const config = { headers: {} as Record<string, string> };
    interceptor(config);
    expect(config.headers['Authorization']).toBeUndefined();
  });

  test('skip the request when there is no access token', () => {
    luigiClient.getToken.mockReturnValue(null); // Mock getToken to return null

    render(
      <TokenInjector>
        <div>Test Component</div>
      </TokenInjector>
    );

    expect(axios.interceptors.request.use).toHaveBeenCalled();
    const interceptor = (axios.interceptors.request.use as jest.Mock).mock.calls[0][0];
    const config = { headers: {} as Record<string, string> };
    interceptor(config);
    expect(config.headers['Authorization']).toBeUndefined();
  });
});

describe('skipRequestWhenNoToken Middleware', () => {
  const fetcher = jest.fn(() => 'fetched data');

  const luigiClient = require('@luigi-project/client');

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variable
    process.env.NEXT_PUBLIC_GRANT_TOKEN = '';
  });

  test('skip the request when there is no access token', () => {
    luigiClient.getToken.mockReturnValue(null); // Mock getToken to return null
    const { result } = renderHook(() => useSWR('test-key', fetcher), {
      wrapper: ({ children }) => <TokenInjector>{children}</TokenInjector>,
    });

    // fetcher should not be called
    expect(result.current.data).toBeUndefined();
    expect(fetcher).not.toHaveBeenCalled();
  });
  test('execute the request when there is an access token', async () => {
    luigiClient.getToken.mockReturnValue('validToken'); // Mock getToken to return a valid token

    const { result } = renderHook(() => useSWR('test-key', fetcher), {
      wrapper: ({ children }) => <TokenInjector>{children}</TokenInjector>,
    });

    await waitFor(() => {
      expect(result.current.data).toBe('fetched data');
    });
    expect(fetcher).toHaveBeenCalled();
  });
});
