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

import { APIProcessorType, APIPromQLSingle } from '@/shared-modules/types';

const processorCount: { [key in APIProcessorType]: number } = {
  Accelerator: 3,
  CPU: 5,
  DSP: 2,
  FPGA: 2,
  GPU: 4,
  UnknownProcessor: 1,
};

const memoryIDs: string[] = ['res10201', 'res10202', 'res10203', 'res10204', 'res10205', 'res10206', 'res10207'];

export const dummyQuery: APIPromQLSingle = {
  status: 'success',
  data: {
    resultType: 'vector',
    result: [
      {
        metric: {
          data_label: 'storage_usage',
        },
        value: [1701755114, '9600000000000'],
      },
      ...memoryIDs.map((id) => ({
        metric: {
          __name__: 'memory_usedMemory',
          data_label: 'usage',
          instance: `xxx`,
          job: `${id}`,
        },
        value: [1701755114, (Math.random() * (4 * 1024 * 1024)).toString()] as [number, string],
      })),
      ...Object.entries(processorCount).flatMap(([processor, count]) =>
        Array.from({ length: count }).map(() => ({
          metric: {
            __name__: `${processor}_usageRate`,
            data_label: 'usage',
            instance: 'xxx',
            job: 'xxx',
          },
          value: [1701755114, (Math.random() * 100).toString()] as [number, string],
        }))
      ),
    ],
  },
  stats: {
    seriesFetched: '6',
  },
};
