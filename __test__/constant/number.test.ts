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
  DECIMAL_PLACES,
  KB,
  KIB,
  PAGE_SIZES,
  PERCENT,
  STATUS_CODE,
  TABLE_MIN_HEIGHT,
} from '@/shared-modules/constant';

describe('Constant Number', () => {
  test('Correctly constant number', () => {
    expect(PERCENT).toBe(100);
    expect(KIB).toBe(1024);
    expect(KB).toBe(1000);
    expect(DECIMAL_PLACES).toBe(2);
    expect(PAGE_SIZES).toEqual([10, 25, 50, 100]);
    expect(TABLE_MIN_HEIGHT).toBe(200);
    expect(STATUS_CODE.OK).toBe(200);
    expect(STATUS_CODE.CREATED).toBe(201);
    expect(STATUS_CODE.NO_CONTENT).toBe(204);
    expect(STATUS_CODE.BAD_REQUEST).toBe(400);
    expect(STATUS_CODE.UNAUTHORIZED).toBe(401);
    expect(STATUS_CODE.FORBIDDEN).toBe(403);
    expect(STATUS_CODE.NOT_FOUND).toBe(404);
    expect(STATUS_CODE.CONFLICT).toBe(409);
    expect(STATUS_CODE.INTERNAL_SERVER_ERROR).toBe(500);
  });
});
