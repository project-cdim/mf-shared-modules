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

import { renderHook } from '@testing-library/react';
import _ from 'lodash';
import useSWRImmutable from 'swr/immutable';

import { APIPromQL } from '@/shared-modules/types';
import { useEnergyDonutChartData } from '@/shared-modules/utils/hooks';

jest.mock('swr/immutable');

const resData: APIPromQL & { url?: string } = {
  status: 'dummy',
  data: {
    resultType: 'dummy',
    result: [
      {
        metric: {
          __name__: '',
          instance: '',
          job: '',
          data_label: 'CPU_energy',
        },
        values: [
          [1701820800, '360000'], // 2023-12-06T00:00:00Z
          [1701824400, '720000'],
          [1701828000, '1080000'],
          [1701831600, '1440000'], // 2023-12-06T03:00:00Z
        ],
      },
      {
        metric: {
          __name__: '',
          instance: '',
          job: '',
          data_label: 'memory_energy',
        },
        values: [
          [1701820800, '360000'], // 2023-12-06T00:00:00Z
          [1701824400, '720000'],
          [1701828000, '1080000'],
          [1701831600, '1440000'], // 2023-12-06T03:00:00Z
        ],
      },
      {
        metric: {
          __name__: '',
          instance: '',
          job: '',
          data_label: 'storage_energy',
        },
        values: [
          [1701820800, '0'], // 2023-12-06T00:00:00Z
          [1701824400, 'not_number'],
          [1701828000, 'one1'],
          [1701831600, '0one'], // 2023-12-06T03:00:00Z
          [1701831800, ''], // 2023-12-06T03:00:00Z
        ],
      },
      {
        metric: {
          __name__: '',
          instance: '',
          job: '',
          data_label: 'virtualMedia_energy',
        },
        values: [],
      },
    ],
  },
  stats: {
    seriesFetched: '',
  },
  url: 'http://localhost:9090/api/v1/query_range?query=*_energy&start=2023-12-06T00:00:00.000Z&end=2023-12-06T06:00:00.000Z&step=1h',
};

const resDataNoMetrics = _.cloneDeep(resData);
resDataNoMetrics.data.result[0].values = [];
const resDataNotTarget = _.cloneDeep(resData);
resDataNotTarget.data.result[0].metric.data_label = 'not_target';

const resDataNoUrl = _.cloneDeep(resData);
resDataNoUrl.url = undefined;
const resDataUrlEmptyString = _.cloneDeep(resData);
resDataUrlEmptyString.url = '';
const resDataNoStartQuery = _.cloneDeep(resData);
resDataNoStartQuery.url =
  'http://localhost:9090/api/v1/query_range?query=*_energy&end=2023-12-06T06:00:00.000Z&step=1h';
const resDataNoEndQuery = _.cloneDeep(resData);
resDataNoEndQuery.url =
  'http://localhost:9090/api/v1/query_range?query=*_energy&start=2023-12-06T00:00:00.000Z&step=1h';
const resDataNoDateQuery = _.cloneDeep(resData);
resDataNoDateQuery.url = 'http://localhost:9090/api/v1/query_range?query=*_energy&step=1h';

describe('useEnergyDonutChartData', () => {
  beforeEach(() => {
    (useSWRImmutable as unknown as jest.Mock).mockReset();
  });

  test('if fetched data and contains neccesarry data, return parsed data', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: resData,
      error: null,
      isValidating: false,
    }));

    const {
      result: {
        current: { donutChartData, donutChartError, donutChartValidating },
      },
    } = renderHook(() => useEnergyDonutChartData());

    expect(donutChartData).toEqual([
      { name: 'Accelerator', value: undefined },
      { name: 'CPU', value: 1000 },
      { name: 'DSP', value: undefined },
      { name: 'FPGA', value: undefined },
      { name: 'GPU', value: undefined },
      { name: 'UnknownProcessor', value: undefined },
      { name: 'Memory', value: 1000 },
      { name: 'Storage', value: 0 },
      { name: 'NetworkInterface', value: undefined },
      { name: 'GraphicController', value: undefined },
      { name: 'VirtualMedia', value: 0 },
    ]);
    expect(donutChartError).toBeDefined();
    expect(donutChartValidating).toBeDefined();
  });

  test('if not fetched data, return array of all types with value undefined', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: false,
    }));

    const {
      result: {
        current: { donutChartData, donutChartError, donutChartValidating },
      },
    } = renderHook(() => useEnergyDonutChartData());

    expect(donutChartData).toEqual([
      { value: undefined, name: 'Accelerator' },
      { value: undefined, name: 'CPU' },
      { value: undefined, name: 'DSP' },
      { value: undefined, name: 'FPGA' },
      { value: undefined, name: 'GPU' },
      { value: undefined, name: 'UnknownProcessor' },
      { value: undefined, name: 'Memory' },
      { value: undefined, name: 'Storage' },
      { value: undefined, name: 'NetworkInterface' },
      { value: undefined, name: 'GraphicController' },
      { value: undefined, name: 'VirtualMedia' },
    ]);
    expect(donutChartError).toBeDefined();
    expect(donutChartValidating).toBeDefined();
  });

  test.each([
    ['error', false],
    [undefined, true],
  ])('if error or loading state not falsy, return value: %o, %o', (error, loading) => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: error,
      isValidating: loading,
    }));

    const {
      result: {
        current: { donutChartData, donutChartError, donutChartValidating },
      },
    } = renderHook(() => useEnergyDonutChartData());

    expect(donutChartData).toEqual([
      { value: undefined, name: 'Accelerator' },
      { value: undefined, name: 'CPU' },
      { value: undefined, name: 'DSP' },
      { value: undefined, name: 'FPGA' },
      { value: undefined, name: 'GPU' },
      { value: undefined, name: 'UnknownProcessor' },
      { value: undefined, name: 'Memory' },
      { value: undefined, name: 'Storage' },
      { value: undefined, name: 'NetworkInterface' },
      { value: undefined, name: 'GraphicController' },
      { value: undefined, name: 'VirtualMedia' },
    ]);
    expect(donutChartError).toBe(error);
    expect(donutChartValidating).toBe(loading);
  });
});
