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
import { bytesToUnit } from './bytesToUnit';
import { typeToVolumeKey } from './typeToVolumeKey';

/**
 * Returns the appropriate unit for the type
 * If it is a capacity, calculate and return the unit
 *
 * @param type Device type
 * @param volume Volume value
 * @returns Unit string
 */
export const typeToUnit = (type: APIDeviceType, volume: number): string => {
  if (type.toUpperCase() === 'memory'.toUpperCase()) {
    /** MiB to B */
    const bytes = volume * KIB * KIB;
    return bytesToUnit(bytes);
  } else if (type.toUpperCase() === 'storage'.toUpperCase()) {
    return bytesToUnit(volume);
  }
  if (typeToVolumeKey[type] === 'totalCores') {
    return 'cores';
  }
  return '';
};
