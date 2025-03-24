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

import { DECIMAL_PLACES, KIB } from '../constant';

/**
 * Return the number according to the unit passed
 *
 * @param bytes byte
 * @param unit unit
 * @returns Converted number (string)
 */
export const formatBytes = (bytes: number, unit: string): string => {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const unitIndex = units.indexOf(unit);

  if (unitIndex === -1) {
    return '';
  }
  const bytesInTargetUnit = bytes / KIB ** unitIndex; // = bytes / Math.pow(2, unitIndex * 10);
  return bytesInTargetUnit.toFixed(DECIMAL_PLACES);
};
