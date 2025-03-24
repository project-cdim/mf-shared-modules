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

import { renderHook } from '@testing-library/react';
import jwt from 'jsonwebtoken';

import { useLuigiClient, usePermission } from '@/shared-modules/utils/hooks';

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useLuigiClient: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));

describe('usePermission', () => {
  test('should return true if the role exists', () => {
    const roleName = 'admin';
    const token = 'mocked_token';
    const decodedToken = {
      realm_access: {
        roles: ['admin', 'user'],
      },
    };
    (useLuigiClient as unknown as jest.Mock).mockReturnValue({ getToken: () => token });
    (jwt.decode as unknown as jest.Mock).mockReturnValue(decodedToken);
    const { result } = renderHook(() => usePermission(roleName));
    expect(result.current).toBe(true);
  });

  test('should return false if the role does not exist', () => {
    const roleName = 'xxx';
    const token = 'mocked_token';
    const decodedToken = {
      realm_access: {
        roles: ['admin', 'user'],
      },
    };
    (useLuigiClient as unknown as jest.Mock).mockReturnValue({ getToken: () => token });
    (jwt.decode as unknown as jest.Mock).mockReturnValue(decodedToken);
    const { result } = renderHook(() => usePermission(roleName));
    expect(result.current).toBe(false);
  });

  test('should return false if the token does not exist', () => {
    const roleName = 'admin';
    const token = 'mocked_token';

    (useLuigiClient as unknown as jest.Mock).mockReturnValue({ getToken: () => token });
    (jwt.decode as unknown as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => usePermission(roleName));
    expect(result.current).toBe(false);
  });
});
