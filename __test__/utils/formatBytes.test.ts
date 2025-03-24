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

import { formatBytes } from '@/shared-modules/utils/formatBytes';

describe('formatBytes', () => {
  test('Check Bytes', () => {
    expect(formatBytes(500, 'B')).toBe('500.00');
  });

  test('Check minimum value for each unit', () => {
    expect(formatBytes(1, 'B')).toBe('1.00');
    expect(formatBytes(1024, 'KiB')).toBe('1.00');
    expect(formatBytes(1024 ** 2, 'MiB')).toBe('1.00');
    expect(formatBytes(1024 ** 3, 'GiB')).toBe('1.00');
    expect(formatBytes(1024 ** 4, 'TiB')).toBe('1.00');
    expect(formatBytes(1024 ** 5, 'PiB')).toBe('1.00');
    expect(formatBytes(1024 ** 6, 'EiB')).toBe('1.00');
    expect(formatBytes(1024 ** 7, 'ZiB')).toBe('1.00');
    expect(formatBytes(1024 ** 8, 'YiB')).toBe('1.00');
  });

  test('Check maximum value for each unit', () => {
    expect(formatBytes(1023, 'B')).toBe('1023.00');
    // Below, 1023.999.. is rounded to 1024.00
    expect(formatBytes(1024 ** 2 - 1, 'KiB')).toBe('1024.00');
    expect(formatBytes(1024 ** 3 - 1, 'MiB')).toBe('1024.00');
    expect(formatBytes(1024 ** 4 - 1, 'GiB')).toBe('1024.00');
    expect(formatBytes(1024 ** 5 - 1, 'TiB')).toBe('1024.00');
    expect(formatBytes(1024 ** 6 - 1, 'PiB')).toBe('1024.00');
    expect(formatBytes(1024 ** 7 - 1, 'EiB')).toBe('1024.00');
    expect(formatBytes(1024 ** 8 - 1, 'ZiB')).toBe('1024.00');
    expect(formatBytes(1024 ** 9 - 1, 'YiB')).toBe('1024.00');
  });

  test('Return empty string for unknown unit', () => {
    expect(formatBytes(1000, 'unknownUnit')).toBe('');
  });
});
