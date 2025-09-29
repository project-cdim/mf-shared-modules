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

import { deviceTypeOrder } from '@/shared-modules/constant';

/** Sort the array of device types in the default order by removing duplicates
 * @param array Array to be sorted
 * @returns Array that has been sorted
 */
export const sortByDeviceType = (array: string[]): string[] => {
  const uniqueArray = Array.from(new Set(array)).toSorted();

  return [
    ...deviceTypeOrder.filter((item) => uniqueArray.includes(item)),
    ...uniqueArray.filter((item) => !(deviceTypeOrder as unknown as string[]).includes(item)),
  ];
};
