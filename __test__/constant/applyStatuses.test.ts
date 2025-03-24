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

import { ApplyStatuses } from '@/shared-modules/constant';

describe('ApplyStatuses', () => {
  test('should contain the correct statuses', () => {
    const expectedStatuses = [
      'IN_PROGRESS',
      'FAILED',
      'COMPLETED',
      'CANCELING',
      'CANCELED',
      'SUSPENDED',
    ];

    expect(ApplyStatuses).toEqual(expectedStatuses);
  });

  test('should be an array of strings', () => {
    ApplyStatuses.forEach((status) => {
      expect(typeof status).toBe('string');
    });
  });

  test('should have the correct length', () => {
    expect(ApplyStatuses).toHaveLength(6);
  });
});
