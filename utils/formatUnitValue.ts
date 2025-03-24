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

import { KIB } from '../constant';
import { formatBytes } from './formatBytes';

/**
 * Returns a number (string) that matches the unit of the passed type
 *
 * @param type Device type
 * @param volume Volume value
 * @param unit Unit
 * @returns Converted number (string)
 */
export const formatUnitValue = (
  type: APIDeviceType,
  volume: number,
  unit: string
): string => {
  if (type.toUpperCase() === 'memory'.toUpperCase()) {
    /** MiB to B */
    const bytes = volume * KIB * KIB;
    return formatBytes(bytes, unit);
  } else if (type.toUpperCase() === 'storage'.toUpperCase()) {
    return formatBytes(volume, unit);
  }
  return volume.toString();
};
