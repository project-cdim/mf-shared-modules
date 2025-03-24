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
import { formatEnergyValue } from '@/shared-modules/utils';
import { useGraphViewPropsOfAll } from '@/shared-modules/utils/hooks';

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
          data_label: 'all_energy',
        },
        values: [
          [1701820800, '100'], // 2023-12-06T00:00:00Z
          [1701824400, '200'],
          [1701828000, '300'],
          [1701831600, '400'], // 2023-12-06T03:00:00Z
        ],
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

describe('useGraphViewPropsOfAll', () => {
  beforeEach(() => {
    (useSWRImmutable as unknown as jest.Mock).mockReset();
  });

  test('if fetched data and not contains neccesarry data, return parsed data', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: resData,
      error: null,
      isValidating: false,
    }));

    const {
      result: {
        current: { areaChartProps, areaChartError, areaChartValidating },
      },
    } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

    expect(areaChartProps).toEqual({
      title: 'Energy Consumptions',
      data: [
        { date: '12/6/2023, 12:00:00 AM', All: 100 },
        { date: '12/6/2023, 1:00:00 AM', All: 200 },
        { date: '12/6/2023, 2:00:00 AM', All: 300 },
        { date: '12/6/2023, 3:00:00 AM', All: 400 },
        { date: '12/6/2023, 4:00:00 AM', All: null },
        { date: '12/6/2023, 5:00:00 AM', All: null },
        { date: '12/6/2023, 6:00:00 AM', All: null },
      ],
      valueFormatter: formatEnergyValue,
      linkTitle: 'Summary',
      link: '/cdim/res-summary',
      query: { tab: 'all' },
    });
    expect(areaChartError).toBeDefined();
    expect(areaChartValidating).toBeDefined();
  });

  test.each([resDataNotTarget, resDataNoMetrics])(
    'if fetched data and not contains target metrics data, return undefined: %o',
    (resData) => {
      (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
        data: resData,
        error: null,
        isValidating: false,
      }));

      const {
        result: {
          current: { areaChartProps, areaChartError, areaChartValidating },
        },
      } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      expect(areaChartProps).toEqual({
        title: 'Energy Consumptions',
        data: undefined,
        valueFormatter: formatEnergyValue,
        linkTitle: 'Summary',
        link: '/cdim/res-summary',
        query: { tab: 'all' },
      });
      expect(areaChartError).toBeDefined();
      expect(areaChartValidating).toBeDefined();
    }
  );

  test.each([resDataNoUrl, resDataUrlEmptyString, resDataNoStartQuery, resDataNoEndQuery, resDataNoDateQuery])(
    'if fetched data and not contains date data, return undefined: %o',
    (resData) => {
      (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
        data: resData,
        error: null,
        isValidating: false,
      }));

      const {
        result: {
          current: { areaChartProps, areaChartError, areaChartValidating },
        },
      } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      expect(areaChartProps).toEqual({
        title: 'Energy Consumptions',
        data: undefined,
        valueFormatter: formatEnergyValue,
        linkTitle: 'Summary',
        link: '/cdim/res-summary',
        query: { tab: 'all' },
      });
      expect(areaChartError).toBeDefined();
      expect(areaChartValidating).toBeDefined();
    }
  );

  test('if not fetched data, return props with undefined data', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: null,
      isValidating: false,
    }));

    const {
      result: {
        current: { areaChartProps, areaChartError, areaChartValidating },
      },
    } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

    expect(areaChartProps).toEqual({
      title: 'Energy Consumptions',
      data: undefined,
      valueFormatter: formatEnergyValue,
      linkTitle: 'Summary',
      link: '/cdim/res-summary',
      query: { tab: 'all' },
    });
    expect(areaChartError).toBeDefined();
    expect(areaChartValidating).toBeDefined();
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
        current: { areaChartProps, areaChartError, areaChartValidating },
      },
    } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

    expect(areaChartProps).toEqual({
      title: 'Energy Consumptions',
      data: undefined,
      valueFormatter: formatEnergyValue,
      linkTitle: 'Summary',
      link: '/cdim/res-summary',
      query: { tab: 'all' },
    });
    expect(areaChartError).toBe(error);
    expect(areaChartValidating).toBe(loading);
  });
});
