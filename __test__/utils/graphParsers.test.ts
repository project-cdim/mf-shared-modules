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

import {
  fillMissingGraphData,
  formatStep,
  getStepFromRange,
  getTargetMetrics,
  mergeMultiGraphData,
  parseGraphData,
  parseStringIntoNumber,
} from '@/shared-modules/utils/graphParsers';

describe('getTargetMetrics', () => {
  test('should return undefined when data is undefined', () => {
    expect(getTargetMetrics(undefined, 'test_label')).toBeUndefined();
  });
  test('should return undefined when no matching data_label is found', () => {
    const mockData = {
      status: 'success',
      data: {
        resultType: 'matrix',
        result: [
          {
            metric: { data_label: 'other_label', instance: 'xxx', job: 'xxx' },
            values: [[1, '10']] as [number, string][],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };
    expect(getTargetMetrics(mockData, 'test_label')).toBeUndefined();
  });
  test('should return matching values when data_label is found', () => {
    const expectedValues = [[1, '10']] as [number, string][];
    const mockData = {
      status: 'success',
      data: {
        resultType: 'matrix',
        result: [
          {
            metric: { data_label: 'test_label', instance: 'xxx', job: 'xxx' },
            values: expectedValues,
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };
    expect(getTargetMetrics(mockData, 'test_label')).toEqual(expectedValues);
  });
});

describe('parseStringIntoNumber', () => {
  test('should parse valid number string to number', () => {
    expect(parseStringIntoNumber('123')).toBe(123);
    expect(parseStringIntoNumber('123.45')).toBe(123.45);
    expect(parseStringIntoNumber('0')).toBe(0);
    expect(parseStringIntoNumber('-123')).toBe(-123);
  });
  test('should return null for empty/space/tab', () => {
    expect(parseStringIntoNumber('')).toBeNull();
    expect(parseStringIntoNumber(' ')).toBeNull();
    expect(parseStringIntoNumber('\t')).toBeNull();
  });
  test('should return null for invalid number strings', () => {
    expect(parseStringIntoNumber('abc')).toBeNull();
    expect(parseStringIntoNumber('123abc')).toBeNull();
    expect(parseStringIntoNumber('NaN')).toBeNull();
    expect(parseStringIntoNumber('Infinity')).toBeNull();
  });
});

describe('formatStep', () => {
  test('should format seconds to days', () => {
    expect(formatStep(86400)).toBe('1d');
    expect(formatStep(172800)).toBe('2d');
    expect(formatStep(2592000)).toBe('30d');
  });
  test('should format seconds to hours', () => {
    expect(formatStep(3600)).toBe('1h');
    expect(formatStep(7200)).toBe('2h');
    expect(formatStep(43200)).toBe('12h');
  });
  test('should format seconds to minutes', () => {
    expect(formatStep(60)).toBe('1m');
    expect(formatStep(300)).toBe('5m');
    expect(formatStep(900)).toBe('15m');
  });
  test('should format seconds to seconds', () => {
    expect(formatStep(1)).toBe('1s');
    expect(formatStep(30)).toBe('30s');
    expect(formatStep(59)).toBe('59s');
  });
});

describe('getStepFromRange', () => {
  test('should return default step when start or end is undefined', () => {
    expect(getStepFromRange(undefined, '2023-07-10T00:00:00Z')).toBe('1h');
    expect(getStepFromRange('2023-07-09T00:00:00Z', undefined)).toBe('1h');
    expect(getStepFromRange(undefined, undefined)).toBe('1h');
  });
  test('should return default step for invalid date strings', () => {
    expect(getStepFromRange('invalid', '2023-07-10T00:00:00Z')).toBe('1h');
    expect(getStepFromRange('2023-07-09T00:00:00Z', 'invalid')).toBe('1h');
  });
  test('should return default step when range is negative or zero', () => {
    expect(getStepFromRange('2023-07-10T00:00:00Z', '2023-07-09T00:00:00Z')).toBe('1h');
    expect(getStepFromRange('2023-07-09T00:00:00Z', '2023-07-09T00:00:00Z')).toBe('1h');
  });
  test('should return appropriate step for short/medium/long time ranges', () => {
    const now = Date.now();
    expect(getStepFromRange(new Date(now).toISOString(), new Date(now + 3600 * 1000).toISOString())).toBe('10m');
    const med = getStepFromRange(new Date(now).toISOString(), new Date(now + 24 * 3600 * 1000).toISOString());
    expect(['10m', '15m', '30m', '1h']).toContain(med);
    const long = getStepFromRange(new Date(now).toISOString(), new Date(now + 30 * 24 * 3600 * 1000).toISOString());
    expect(['1h', '2h', '3h', '6h', '12h', '1d', '2d', '3d', '5d', '7d', '15d', '30d']).toContain(long);
  });
  test('should return maximum step for extremely long time ranges', () => {
    // Always go through the MAX branch with a 1000-year range
    const start = new Date('1000-01-01T00:00:00Z').toISOString();
    const end = new Date('3000-01-01T00:00:00Z').toISOString();
    const result = getStepFromRange(start, end);
    expect(result).toBe('30d');
  });
});

describe('mergeMultiGraphData', () => {
  test('should return empty array for empty array input', () => {
    expect(mergeMultiGraphData([])).toEqual([]);
  });
  test('should handle arrays with undefined values', () => {
    const data1 = [{ date: '2023-07-09 12:00:00', CPU: 10 }];
    expect(mergeMultiGraphData([data1, undefined])).toEqual(data1);
    expect(mergeMultiGraphData([undefined, data1])).toEqual(data1);
    expect(mergeMultiGraphData([undefined, undefined])).toEqual([]);
  });
  test('should merge data arrays with different dates', () => {
    const data1 = [{ date: '2023-07-09 12:00:00', CPU: 10 }];
    const data2 = [{ date: '2023-07-09 13:00:00', Memory: 20 }];
    const expected = [
      { date: '2023-07-09 12:00:00', CPU: 10 },
      { date: '2023-07-09 13:00:00', Memory: 20 },
    ];
    expect(mergeMultiGraphData([data1, data2])).toEqual(expected);
  });
  test('should merge data arrays with overlapping dates', () => {
    const data1 = [
      { date: '2023-07-09 12:00:00', CPU: 10 },
      { date: '2023-07-09 13:00:00', CPU: 15 },
    ];
    const data2 = [
      { date: '2023-07-09 12:00:00', Memory: 20 },
      { date: '2023-07-09 14:00:00', Memory: 25 },
    ];
    const expected = [
      { date: '2023-07-09 12:00:00', CPU: 10, Memory: 20 },
      { date: '2023-07-09 13:00:00', CPU: 15 },
      { date: '2023-07-09 14:00:00', Memory: 25 },
    ];
    expect(mergeMultiGraphData([data1, data2])).toEqual(expected);
  });
  test('should handle later arrays overwriting earlier ones for the same date', () => {
    const data1 = [{ date: '2023-07-09 12:00:00', CPU: 10, Memory: 50 }];
    const data2 = [{ date: '2023-07-09 12:00:00', CPU: 20, Storage: 30 }];
    const expected = [{ date: '2023-07-09 12:00:00', CPU: 20, Memory: 50, Storage: 30 }];
    expect(mergeMultiGraphData([data1, data2])).toEqual(expected);
  });
});

describe('fillMissingGraphData', () => {
  test('should fill with correct step for 5m', () => {
    const now = new Date();
    const start = new Date(now.getTime() - 15 * 60 * 1000).toISOString(); // 15 minutes ago
    const end = now.toISOString();
    const data = [{ date: now.toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '5m');
    expect(result).toBeDefined();
    if (result) {
      // 15min/5min=3 intervals, test the number of points
      expect(result.length).toBe(3);
    }
  });
  test('should fill with correct step for 2h', () => {
    const now = new Date();
    const start = new Date(now.getTime() - 4 * 3600 * 1000).toISOString(); // 4時間前
    const end = now.toISOString();
    const data = [{ date: now.toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '2h');
    expect(result).toBeDefined();
    if (result) {
      // 4時間/2時間=2区間 での点数をテスト
      expect(result.length).toBe(2);
    }
  });
  test('should fill with correct step for 1d', () => {
    const now = new Date();
    const start = new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(); // 2日前
    const end = now.toISOString();
    const data = [{ date: now.toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '1d');
    expect(result).toBeDefined();
    if (result) {
      // 2日/1日=2区間 での点数をテスト
      expect(result.length).toBe(2);
    }
  });
  test('should fill with correct step for 30s', () => {
    const now = new Date();
    const start = new Date(now.getTime() - 90 * 1000).toISOString(); // 90秒前
    const end = now.toISOString();
    const data = [{ date: now.toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '30s');
    expect(result).toBeDefined();
    if (result) {
      // 90秒/30秒=3区間 での点数をテスト
      expect(result.length).toBe(3);
    }
  });
  // parseStepToSecondsの分岐は直接テストでカバーするため、ここは省略
  test('should return undefined for invalid inputs', () => {
    expect(fillMissingGraphData(undefined, '2023-07-09T00:00:00Z', '2023-07-10T00:00:00Z', 'en')).toBeUndefined();
    expect(fillMissingGraphData([], '2023-07-09T00:00:00Z', '2023-07-10T00:00:00Z', 'en')).toBeUndefined();
    expect(
      fillMissingGraphData([{ date: '2023-07-09 12:00:00', CPU: 10 }], undefined, '2023-07-10T00:00:00Z', 'en')
    ).toBeUndefined();
    expect(
      fillMissingGraphData([{ date: '2023-07-09 12:00:00', CPU: 10 }], '2023-07-09T00:00:00Z', undefined, 'en')
    ).toBeUndefined();
  });
  test('should return undefined for invalid date strings', () => {
    expect(
      fillMissingGraphData([{ date: '2023-07-09 12:00:00', CPU: 10 }], 'invalid', '2023-07-10T00:00:00Z', 'en')
    ).toBeUndefined();
  });
  test('should fill missing data points with null values', () => {
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() - 2);
    const endTime = new Date(now);
    endTime.setHours(endTime.getHours() + 1);
    const start = startTime.toISOString();
    const end = endTime.toISOString();
    const data = [{ date: new Date(now).toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '1h');
    expect(result).toBeDefined();
    if (result) {
      expect(result.length).toBeGreaterThanOrEqual(3);
      const middlePoint = result.find((item) => item.CPU === 10);
      expect(middlePoint).toBeDefined();
      const nullPoints = result.filter((item) => item.CPU === null);
      expect(nullPoints.length).toBeGreaterThanOrEqual(2);
    }
  });
  test('should use provided step value', () => {
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() - 1);
    const endTime = new Date(now);
    endTime.setMinutes(endTime.getMinutes() + 30);
    const start = startTime.toISOString();
    const end = endTime.toISOString();
    const data = [{ date: new Date(now).toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '15m');
    expect(result).toBeDefined();
    if (result) {
      expect(result.length).toBeGreaterThanOrEqual(4);
    }
  });
  test('should cover parseStepToSeconds default case', () => {
    const data = [{ date: '2023-07-09 12:00:00', CPU: 10 }];
    const start = '2023-07-09T00:00:00Z';
    const end = '2023-07-09T12:00:00Z';
    const result = fillMissingGraphData(data, start, end, 'en', 'invalid');
    expect(result).toBeDefined();
  });

  test('should cover parseStepToSeconds switch default case', () => {
    const data = [{ date: '2023-07-09 12:00:00', CPU: 10 }];
    const start = '2023-07-09T00:00:00Z';
    const end = '2023-07-09T12:00:00Z';
    // 数字+文字のフォーマットだが、s,m,h,d以外の文字を使用するとswitchのdefaultケースに入る
    const result = fillMissingGraphData(data, start, end, 'en', '5x');
    expect(result).toBeDefined();
    if (result) {
      // デフォルトでは3600秒(1h)が使用されるため、12時間/1時間=13ポイント（開始点と終了点を含む）
      const expectedLength = 13;
      expect(result.length).toBe(expectedLength);
    }
  });
  test('should cover calculateStartAlignment with data after start time', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const start = new Date((timestamp - 3600) * 1000).toISOString();
    const end = new Date((timestamp + 3600) * 1000).toISOString();
    const data = [{ date: new Date((timestamp - 1800) * 1000).toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '30m');
    expect(result).toBeDefined();
    if (result) {
      expect(result.length).toBeGreaterThanOrEqual(3);
    }
  });
  test('should cover calculateStartAlignment with data before start time', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const start = new Date(timestamp * 1000).toISOString();
    const end = new Date((timestamp + 3600) * 1000).toISOString();
    const data = [{ date: new Date((timestamp - 3600) * 1000).toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '30m');
    expect(result).toBeDefined();
  });
  test('should cover calculateStartAlignment when times are exactly equal', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const startDate = new Date(timestamp * 1000);
    const start = startDate.toISOString();
    const end = new Date((timestamp + 3600) * 1000).toISOString();
    const data = [{ date: startDate.toLocaleString('en'), CPU: 10 }];
    const result = fillMissingGraphData(data, start, end, 'en', '30m');
    expect(result).toBeDefined();
  });
});

describe('parseGraphData', () => {
  test('should return undefined when graphData is undefined', () => {
    expect(
      parseGraphData(undefined, 'cpu_usage', 'en', '2023-07-09T00:00:00Z', '2023-07-10T00:00:00Z')
    ).toBeUndefined();
  });
  test('should return undefined when no matching metrics are found', () => {
    const mockData = {
      status: 'success',
      data: {
        resultType: 'matrix',
        result: [
          {
            metric: { data_label: 'other_label', instance: 'xxx', job: 'xxx' },
            values: [[1, '10']] as [number, string][],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };
    expect(parseGraphData(mockData, 'cpu_usage', 'en', '2023-07-09T00:00:00Z', '2023-07-10T00:00:00Z')).toBeUndefined();
  });
  test('should parse and format graph data correctly', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const mockData = {
      status: 'success',
      data: {
        resultType: 'matrix',
        result: [
          {
            metric: { data_label: 'CPU_usage', instance: 'xxx', job: 'xxx' },
            values: [
              [timestamp, '10'],
              [timestamp + 3600, '20'],
            ] as [number, string][],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };
    const start = new Date((timestamp - 3600) * 1000).toISOString();
    const end = new Date((timestamp + 7200) * 1000).toISOString();
    const result = parseGraphData(mockData, 'CPU_usage', 'en', start, end);
    expect(result).toBeDefined();
    if (result) {
      expect(result.length).toBeGreaterThanOrEqual(3);
      const dataPoints = result.filter((point) => point.CPU !== null);
      expect(dataPoints.length).toBeGreaterThanOrEqual(1);
      if (dataPoints.length > 0) {
        expect(typeof dataPoints[0].CPU).toBe('number');
      }
    }
  });
  test('should handle multiple data categories', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const mockData = {
      status: 'success',
      data: {
        resultType: 'matrix',
        result: [
          {
            metric: { data_label: 'Memory_usage', instance: 'xxx', job: 'xxx' },
            values: [
              [timestamp, '50'],
              [timestamp + 3600, '60'],
            ] as [number, string][],
          },
        ],
      },
      stats: { seriesFetched: '1' },
    };
    const start = new Date((timestamp - 3600) * 1000).toISOString();
    const end = new Date((timestamp + 7200) * 1000).toISOString();
    const result = parseGraphData(mockData, 'Memory_usage', 'en', start, end);
    expect(result).toBeDefined();
    if (result) {
      const dataPoints = result.filter((point) => point.Memory !== null);
      expect(dataPoints.length).toBeGreaterThanOrEqual(1);
      if (dataPoints.length > 0) {
        expect(typeof dataPoints[0].Memory).toBe('number');
      }
    }
  });
  test('should handle invalid number values', () => {
    const mockData = {
      status: 'success',
      data: { resultType: 'matrix', result: [] },
      stats: { seriesFetched: '0' },
    };
    const result = parseGraphData(mockData, 'CPU_usage', 'en', undefined, undefined);
    expect(result).toBeUndefined();
  });
});
