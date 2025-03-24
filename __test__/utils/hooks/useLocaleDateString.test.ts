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
import { useLocale } from 'next-intl';

import { useLocaleDateString } from '@/shared-modules/utils/hooks';

describe('useLocaleDateString', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the localized date and time', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('en');

    const testDate = new Date('2024-05-21T10:20:30Z');
    const { result } = renderHook(() => useLocaleDateString(testDate));

    expect(result.current).toBe(testDate.toLocaleString('en'));
  });

  test('should return the localized date', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('en');

    const testDate = new Date('2024-05-21T10:20:30Z');
    const { result } = renderHook(() => useLocaleDateString(testDate, 'date'));

    expect(result.current).toBe(testDate.toLocaleDateString('en'));
  });

  test('should return the localized time', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('en');

    const testDate = new Date('2024-05-21T10:20:30Z');
    const { result } = renderHook(() => useLocaleDateString(testDate, 'time'));

    expect(result.current).toBe(testDate.toLocaleTimeString('en'));
  });

  test('should return the current date and time if date is undefined', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('en');

    const currentDate = new Date();
    const { result } = renderHook(() => useLocaleDateString(undefined));

    expect(result.current).toBe(currentDate.toLocaleString('en'));
  });
});
