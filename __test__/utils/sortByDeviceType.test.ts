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

import { APIDeviceType } from '@/shared-modules/types';
import { sortByDeviceType } from '@/shared-modules/utils/sortByDeviceType';

describe('sortByDeviceType', () => {
  test('Sorts an array of device types, removing duplicates and ordering them in the default order', () => {
    const array: APIDeviceType[] = ['CPU', 'GPU', 'CPU', 'CPU', 'GPU'];
    const result = sortByDeviceType(array);
    expect(result).toStrictEqual(['CPU', 'GPU']);
  });
  test('Returns an empty array if the array of device types is empty', () => {
    const array: APIDeviceType[] = [];
    const result = sortByDeviceType(array);
    expect(result).toStrictEqual([]);
  });
  test('Returns the array as is if there are no duplicates in the array of device types', () => {
    const array: APIDeviceType[] = ['CPU', 'GPU'];
    const result = sortByDeviceType(array);
    expect(result).toStrictEqual(['CPU', 'GPU']);
  });
});
