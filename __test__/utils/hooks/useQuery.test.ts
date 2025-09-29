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

import { useRouter } from 'next/navigation';

import LuigiClient from '@luigi-project/client';
import { renderHook } from '@testing-library/react';

import { useQuery } from '@/shared-modules/utils/hooks';

jest.mock('@luigi-project/client', () => ({
  addInitListener: jest.fn(),
  getNodeParams: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useQuery', () => {
  beforeEach(() => {
    // Run before each test
    jest.resetAllMocks();
    // Reset the implementation of the mock
    (LuigiClient.addInitListener as unknown as jest.Mock).mockImplementation((callback) => {
      callback();
    });
    (LuigiClient.getNodeParams as unknown as jest.Mock).mockReturnValue({ id: 'res101' });
    (useRouter as unknown as jest.Mock).mockImplementation(() => ({
      query: { id: 'res101' },
      isReady: true,
    }));
  });
  test('Returns the state correctly', () => {
    (LuigiClient.getNodeParams as unknown as jest.Mock).mockReturnValue({});
    (useRouter as unknown as jest.Mock).mockReturnValue({
      query: {},
      isReady: true,
    });
    const { result } = renderHook(() => useQuery());
    expect(result.current).toEqual({});
  });
  test('Correctly converts the state to an object and returns it', () => {
    (LuigiClient.getNodeParams as unknown as jest.Mock).mockReturnValue({ id: 'res101' });
    const { result } = renderHook(() => useQuery());
    expect(result.current).toEqual({ id: 'res101' });
  });
});

describe('useQueryArrayObject', () => {
  test('splits comma-separated string into array', () => {
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      query: { foo: 'a,b ,c' },
      isReady: true,
    });
    const { result } = renderHook(() => require('@/shared-modules/utils/hooks/useQuery').useQueryArrayObject());
    expect(result.current.foo).toEqual(['a', 'b ', 'c']);
  });

  test('handles array values and removes empty strings', () => {
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      query: { foo: ['a', '', 'b,c'] },
      isReady: true,
    });
    const { result } = renderHook(() => require('@/shared-modules/utils/hooks/useQuery').useQueryArrayObject());
    expect(result.current.foo).toEqual(['a', 'b', 'c']);
  });

  test('returns empty array for undefined or empty', () => {
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      query: { foo: undefined, bar: '' },
      isReady: true,
    });
    const { result } = renderHook(() => require('@/shared-modules/utils/hooks/useQuery').useQueryArrayObject());
    expect(result.current.foo).toEqual([]);
    expect(result.current.bar).toEqual([]);
  });

  test('returns empty array for non-existent keys', () => {
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      query: { foo: 'a,b,c' },
      isReady: true,
    });
    const { result } = renderHook(() => require('@/shared-modules/utils/hooks/useQuery').useQueryArrayObject());
    expect(result.current.nonExistent).toEqual([]);
  });
});
