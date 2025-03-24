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

import { typeToVolumeKey } from '@/shared-modules/utils';

describe('typeToVolumeKey', () => {
  test('That the value of typeToVolumeKey is correct', () => {
    expect(typeToVolumeKey['CPU']).toBe('totalCores');
    expect(typeToVolumeKey['Accelerator']).toBe('totalCores');
    expect(typeToVolumeKey['DSP']).toBe('totalCores');
    expect(typeToVolumeKey['FPGA']).toBe('totalCores');
    expect(typeToVolumeKey['GPU']).toBe('totalCores');
    expect(typeToVolumeKey['UnknownProcessor']).toBe('totalCores');
    expect(typeToVolumeKey['memory']).toBe('capacityMiB');
    expect(typeToVolumeKey['storage']).toBe('driveCapacityBytes');
    expect(typeToVolumeKey['networkInterface']).toBe(false);
    expect(typeToVolumeKey['graphicController']).toBe(false);
    expect(typeToVolumeKey['virtualMedia']).toBe(false);
  });
});
