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

import { bytesToUnit } from '@/shared-modules/utils/bytesToUnit';

describe('bytesToUnit', () => {
  test('should return "B" when the input is 0', () => {
    expect(bytesToUnit(0)).toBe('B');
  });

  test('should check the minimum unit', () => {
    expect(bytesToUnit(1)).toBe('B');
    expect(bytesToUnit(1024)).toBe('KiB');
    expect(bytesToUnit(1024 ** 2)).toBe('MiB');
    expect(bytesToUnit(1024 ** 3)).toBe('GiB');
    expect(bytesToUnit(1024 ** 4)).toBe('TiB');
    expect(bytesToUnit(1024 ** 5)).toBe('PiB');
    expect(bytesToUnit(1024 ** 6)).toBe('EiB');
    expect(bytesToUnit(1024 ** 7)).toBe('ZiB');
    expect(bytesToUnit(1024 ** 8)).toBe('YiB');
  });

  test('should check the maximum unit', () => {
    expect(bytesToUnit(1024 - 1)).toBe('B');
    expect(bytesToUnit(1024 ** 2 - 1)).toBe('KiB');
    expect(bytesToUnit(1024 ** 3 - 1)).toBe('MiB');
    expect(bytesToUnit(1024 ** 4 - 1)).toBe('GiB');
  });
});
