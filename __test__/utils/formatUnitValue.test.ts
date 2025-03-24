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

import { formatUnitValue } from '@/shared-modules/utils/formatUnitValue';

describe('formatUnitValue', () => {
  test('should return the correct value when type is memory', () => {
    expect(formatUnitValue('memory', 3, 'MiB')).toBe('3.00');
    expect(formatUnitValue('memory', 3 * 1024, 'GiB')).toBe('3.00');
  });
  test('should return the correct value when type is storage', () => {
    expect(formatUnitValue('storage', 3 * 1024 ** 2, 'MiB')).toBe('3.00');
    expect(formatUnitValue('storage', 3 * 1024 ** 3, 'GiB')).toBe('3.00');
  });
  test('should return the correct value when type is other', () => {
    expect(formatUnitValue('CPU', 1234, 'cores')).toBe('1234');
    expect(formatUnitValue('UnknownProcessor', 5678, 'cores')).toBe('5678');
  });
});
