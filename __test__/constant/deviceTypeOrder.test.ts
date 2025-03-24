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

import { deviceTypeOrder, processorTypeOrder } from '@/shared-modules/constant';
import { APIProcessorType } from '@/shared-modules/types';

describe('deviceTypeOrder', () => {
  test('should be an array', () => {
    expect(Array.isArray(processorTypeOrder)).toBe(true);
    expect(Array.isArray(deviceTypeOrder)).toBe(true);
  });

  test('should have correct values for processorTypeOrder', () => {
    const expectedValues: APIProcessorType[] = [
      'Accelerator',
      'CPU',
      'DSP',
      'FPGA',
      'GPU',
      'UnknownProcessor',
    ];
    expect(processorTypeOrder).toEqual(expectedValues);
  });

  test('should have correct values for deviceTypeOrder', () => {
    const expectedValues = [
      'Accelerator',
      'CPU',
      'DSP',
      'FPGA',
      'GPU',
      'UnknownProcessor',
      'memory',
      'storage',
      'networkInterface',
      'graphicController',
      'virtualMedia',
    ];
    expect(deviceTypeOrder).toEqual(expectedValues);
  });
});
