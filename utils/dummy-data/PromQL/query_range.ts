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

import { APIDeviceType, APIPromQL } from '@/shared-modules/types';

const types: (APIDeviceType | 'all')[] = [
  'all',
  'Accelerator',
  'CPU',
  'DSP',
  'FPGA',
  'GPU',
  'memory',
  'storage',
  'networkInterface',
  'UnknownProcessor',
];

// Return APIPromQLRange by passing values array and generating results for each type
export const getAPIPromQLbyValues = (hours: number, multiplyValue: number = 1): APIPromQL => ({
  status: 'success',
  data: {
    resultType: 'matrix',
    result: types.flatMap((type) => [
      {
        metric: {
          data_label: `${type}_energy`,
          instance: 'xxx',
          job: 'xxx',
        },
        values: generateDemoValues(hours, type, 'energy', multiplyValue),
      },
      {
        metric: {
          data_label: `${type}_usage`,
          instance: 'xxx',
          job: 'xxx',
        },
        values: generateDemoValues(hours, type, 'usage', multiplyValue),
      },
    ]),
  },
  stats: {
    seriesFetched: types.length.toString(),
  },
});

// Generate demo values
export const generateDemoValues = (
  hours: number,
  type: APIDeviceType | 'all',
  label: string,
  multiplyValue: number
): [number, string][] => {
  const values: [number, string][] = [];
  const startDate = new Date();
  startDate.setMinutes(0, 0, 0);
  // startDate.setDate(startDate.getDate() - 10); // Set to 10 days ago
  const end = new Date(startDate);
  startDate.setHours(startDate.getHours() - (hours - 1)); // Set to hours ago
  for (let date = new Date(startDate); date <= end; date.setHours(date.getHours() + 1)) {
    const passed = Math.floor((date.getTime() - startDate.getTime()) / 3600000);
    const timestamp = Math.floor(date.getTime() / 1000);
    const value = calculateMetricValue(type, label, passed, multiplyValue);
    values.push([timestamp, value.toString()]);
  }
  return values;
};

// Calculate metric value
const calculateMetricValue = (
  type: APIDeviceType | 'all',
  label: string,
  passed: number,
  multiplyValue: number
): number => {
  if (label === 'energy') {
    const reduction = passed >= 480 ? 0.8 : 1; // 10 days before end
    // const reduction = 1;
    switch (type) {
      case 'CPU':
        return (40000 - passed * 5 + Math.floor(Math.random() * 10000)) * multiplyValue * reduction;
      case 'GPU':
        return (30000 - passed * 5 + Math.floor(Math.random() * 10000)) * multiplyValue * reduction;
      default:
        return (10000 - passed * 5 + Math.floor(Math.random() * 10000)) * multiplyValue * reduction;
      // if (multiplyValue > 1) {
      //   return (10000 + Math.floor(Math.random() * 1000)) * multiplyValue * reduction;
      // }
      // return (10000 + Math.floor(Math.random() * 1000)) * multiplyValue * reduction * 1.62; // Adjusted
      // return 10000 * multiplyValue;
    }
  } else if (label === 'usage') {
    switch (type) {
      case 'CPU':
        return 20 + Math.sin(passed / 1000) * 10 + Math.random() * 40;
      case 'Accelerator':
        return 10 + Math.sin(passed / 200) * 10 + Math.random() * 30;
      case 'DSP':
        return 15 + Math.sin(passed / 400) * 10 + Math.random() * 50;
      case 'FPGA':
        return 0 + Math.sin(passed / 300) * 10 + Math.random() * 30;
      case 'GPU':
        return 20 + Math.sin(passed / 240) * 20 + Math.random() * 30;
      case 'UnknownProcessor':
        return 20 + Math.sin(passed / 600) * 10 + Math.random() * 30;
      case 'memory':
        return 20 + Math.sin(passed / 180) * 10 + Math.random() * 30;
      case 'networkInterface':
        return 1000000 + Math.sin(passed / 90) * 200000 + Math.random() * 1000000;
      case 'storage':
        return 35 + Math.random() * 10;
      default:
        return 20 + Math.sin(passed / 90) * 10 + Math.random() * 30;
    }
  }
  return 0;
};

export const dummyQueryRange: APIPromQL = getAPIPromQLbyValues(30 * 24); // 30 days
export const dummyQueryRangeDonut: APIPromQL = getAPIPromQLbyValues(30 * 24, 3600 / 9); // for Donut chart
