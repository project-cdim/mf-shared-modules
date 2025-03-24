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

import { useIdFromQuery, useQuery } from '../../../utils/hooks';

jest.mock('../../../utils/hooks/useQuery');

describe('useIdFromQuery', () => {
  test('should return the id when it is a string', () => {
    (useQuery as jest.Mock).mockReturnValue({ id: '123' });
    const { result } = renderHook(() => useIdFromQuery());
    expect(result.current).toBe('123');
  });

  test('should return the first id when it is an array of strings', () => {
    (useQuery as jest.Mock).mockReturnValue({ id: ['123', '456'] });
    const { result } = renderHook(() => useIdFromQuery());
    expect(result.current).toBe('123');
  });

  test('should return an empty string when id is not present', () => {
    (useQuery as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useIdFromQuery());
    expect(result.current).toBe('');
  });

  test('should return an empty string when id is not a string or array of strings', () => {
    (useQuery as jest.Mock).mockReturnValue({ id: 123 });
    const { result } = renderHook(() => useIdFromQuery());
    expect(result.current).toBe('');
  });
});
