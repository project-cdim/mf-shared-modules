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

import { availableOrder } from '@/shared-modules/constant';
import { APIDeviceAvailable } from '@/shared-modules/types';

describe('availableOrder', () => {
  test('should be an array', () => {
    expect(Array.isArray(availableOrder)).toBe(true);
  });

  test('should have correct values', () => {
    const expectedValues: APIDeviceAvailable[] = ['Available', 'Unavailable'];
    expect(availableOrder).toEqual(expectedValues);
  });
});
