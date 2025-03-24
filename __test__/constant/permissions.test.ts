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

import {
  MANAGE_LAYOUT,
  MANAGE_RESOURCE,
  MANAGE_USER,
  VIEW_LAYOUT,
  VIEW_RESOURCE,
  VIEW_USER,
} from '@/shared-modules/constant';

describe('Permissions', () => {
  test('should have correct values', () => {
    expect(MANAGE_RESOURCE).toBe('cdim-manage-resource');
    expect(MANAGE_LAYOUT).toBe('cdim-manage-layout');
    expect(MANAGE_USER).toBe('cdim-manage-user');
    expect(VIEW_RESOURCE).toBe('cdim-view-resource');
    expect(VIEW_LAYOUT).toBe('cdim-view-layout');
    expect(VIEW_USER).toBe('cdim-view-user');
  });
});
