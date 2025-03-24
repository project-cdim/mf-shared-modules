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

/** Processor type definition */
export type APIProcessorType =
  | 'Accelerator'
  | 'CPU'
  | 'DSP'
  | 'FPGA'
  | 'GPU'
  | 'UnknownProcessor';

/** Type definition for device type */
export type APIDeviceType =
  | APIProcessorType
  | 'memory'
  | 'storage'
  | 'networkInterface'
  | 'graphicController'
  | 'virtualMedia';

/**
 * Checks if the provided argument is a valid APIDeviceType.
 * @param arg - The argument to be checked.
 * @returns True if the argument is a valid APIDeviceType, false otherwise.
 */
export const isAPIDeviceType = (arg: unknown): arg is APIDeviceType => {
  const types = new Set([
    'Accelerator',
    'CPU',
    'DSP',
    'FPGA',
    'GPU',
    'memory',
    'storage',
    'networkInterface',
    'graphicController',
    'virtualMedia',
    'UnknownProcessor',
  ]);
  return types.has(arg as string);
};
