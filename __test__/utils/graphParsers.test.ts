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

import { APIPromQL } from '@/shared-modules/types';

import {
  fillMissingGraphData,
  mergeMultiGraphData,
  parseGraphData,
  parseStringIntoNumber,
} from '../../utils';

describe('mergeMultiGraphData', () => {
  test('mergeMultiGraphData should merge multiple GraphViewData arrays', () => {
    const data1 = [{ date: '2023-01-01T00:00:00Z', value: 10 }];
    const data2 = [{ date: '2023-01-01T01:00:00Z', value: 20 }];
    const data3 = [{ date: '2023-01-01T01:00:00Z', val: 30 }];
    const result = mergeMultiGraphData([data1, data2, data3]);
    expect(result).toEqual([
      { date: '2023-01-01T00:00:00Z', value: 10 },
      { date: '2023-01-01T01:00:00Z', value: 20, val: 30 },
    ]);
  });

  test('mergeMultiGraphData should handle undefined arrays', () => {
    const data1 = [{ date: '2023-01-01T00:00:00Z', value: 10 }];
    const result = mergeMultiGraphData([data1, undefined]);
    expect(result).toEqual([{ date: '2023-01-01T00:00:00Z', value: 10 }]);
  });
});

describe('fillMissingGraphData', () => {
  test('should return undefined if the graphViewData is undefined', () => {
    expect(
      fillMissingGraphData(
        undefined,
        '2023-12-04T16:07',
        '2023-12-05T16:07',
        'en'
      )
    ).toBeUndefined();
  });

  test('should return undefined if the start or end date is undefined', () => {
    const data = [{ date: '2023-12-04T16:00', CPU: 10 }];
    expect(
      fillMissingGraphData(data, undefined, '2023-12-05T16:07', 'en')
    ).toBeUndefined();
    expect(
      fillMissingGraphData(data, '2023-12-04T16:07', undefined, 'en')
    ).toBeUndefined();
  });

  test('should fill missing data for a given range', () => {
    const data = [
      { date: new Date('2023-12-04T16:00').toLocaleString(), CPU: 10 },
      { date: new Date('2023-12-04T18:00').toLocaleString(), CPU: 10 },
    ];
    const start = '2023-12-04T16:07';
    const end = '2023-12-04T20:07';
    expect(fillMissingGraphData(data, start, end, 'en')?.length).toBe(5);
  });
});

describe('parseGraphData', () => {
  test('parseGraphData should return parsed and filled graph data', () => {
    const mockData: APIPromQL = {
      status: 'success',
      stats: {
        seriesFetched: '1',
      },
      data: {
        resultType: 'matrix',
        result: [
          {
            metric: {
              data_label: 'CPU_label',
              job: 'job1',
              instance: 'instance1',
            },
            values: [
              [1609459200, '10'],
              [1609462800, '20'],
            ],
          },
        ],
      },
    };

    const result = parseGraphData(
      mockData,
      'CPU_label',
      'en-US',
      '2021-01-01T00:00:00Z',
      '2021-01-01T02:00:00Z'
    );

    expect(result).toEqual([
      { date: '1/1/2021, 12:00:00 AM', CPU: 10 },
      { date: '1/1/2021, 1:00:00 AM', CPU: 20 },
      { date: '1/1/2021, 2:00:00 AM', CPU: null },
    ]);
  });

  test.each([
    undefined,
    { data: { result: [] } },
    {
      data: {
        result: [{ metric: { data_label: 'not-target' }, values: [10, '10J'] }],
      },
    },
  ])(
    'parseGraphData should return undefined if no data is provided: %o',
    (data) => {
      const result = parseGraphData(
        data as APIPromQL | undefined,
        'test_label',
        'en-US',
        '2021-01-01T00:00:00Z',
        '2021-01-01T02:00:00Z'
      );
      expect(result).toBeUndefined();
    }
  );
});

describe('parseStringIntoNumber', () => {
  test('should return null for empty string', () => {
    expect(parseStringIntoNumber('')).toBeNull();
  });

  test('should return null for a string with only spaces', () => {
    expect(parseStringIntoNumber(' ')).toBeNull();
  });

  test('should return null for a string with only tabs', () => {
    expect(parseStringIntoNumber('\t')).toBeNull();
  });

  test('should return null for a non-numeric string', () => {
    expect(parseStringIntoNumber('abc')).toBeNull();
  });

  test('should return null for an infinite number', () => {
    expect(parseStringIntoNumber('Infinity')).toBeNull();
  });

  test('should return null for a NaN value', () => {
    expect(parseStringIntoNumber('NaN')).toBeNull();
  });

  test('should parse a valid numeric string', () => {
    expect(parseStringIntoNumber('123')).toBe(123);
  });

  test('should parse a valid negative numeric string', () => {
    expect(parseStringIntoNumber('-123')).toBe(-123);
  });

  test('should parse a valid floating-point numeric string', () => {
    expect(parseStringIntoNumber('123.45')).toBe(123.45);
  });

  test('should parse a valid negative floating-point numeric string', () => {
    expect(parseStringIntoNumber('-123.45')).toBe(-123.45);
  });
});
