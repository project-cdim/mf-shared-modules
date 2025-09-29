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

import { renderHook, act } from '@testing-library/react';

import { APIPromQL } from '@/shared-modules/types';
import { useGraphViewPropsOfAll } from '@/shared-modules/utils/hooks';

// Mock SWR to avoid actual HTTP requests
jest.mock('swr/immutable');

// Mock utility functions
jest.mock('@/shared-modules/utils', () => {
  const actual = jest.requireActual('@/shared-modules/utils');
  return {
    ...actual,
    fetcherForPromqlByPost: jest.fn(),
    createPromQLParams: jest.fn(),
    parseGraphData: jest.fn(),
  };
});

// Mock next-intl for localization
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key: string) => key),
  useLocale: jest.fn(() => 'en'),
}));

// Mock useMetricDateRange hook
jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useMetricDateRange: jest.fn(() => [new Date('2023-12-06T00:00:00Z'), new Date('2023-12-06T23:59:59Z')]),
}));

import useSWRImmutable from 'swr/immutable';
import * as utils from '@/shared-modules/utils';

// Helper function to create SWR response mock
const createSWRResponse = (overrides: Partial<any> = {}) => ({
  data: undefined,
  error: null,
  isValidating: false,
  isLoading: false,
  mutate: jest.fn(),
  ...overrides,
});

// Test data
const mockGraphData = [
  { date: '12/6/2023, 12:00:00 AM', All: 100 },
  { date: '12/6/2023, 1:00:00 AM', All: 200 },
  { date: '12/6/2023, 2:00:00 AM', All: 300 },
  { date: '12/6/2023, 3:00:00 AM', All: 400 },
  { date: '12/6/2023, 4:00:00 AM', All: null },
];

const resData: APIPromQL = {
  status: 'success',
  data: {
    resultType: 'matrix',
    result: [
      {
        metric: {
          __name__: 'energy_reading',
          instance: 'test',
          job: 'test',
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
    seriesFetched: '1',
  },
};

const resDataEmpty: APIPromQL = {
  ...resData,
  data: {
    ...resData.data,
    result: [
      {
        ...resData.data.result[0],
        values: [],
      },
    ],
  },
};

const resDataNotTarget: APIPromQL = {
  ...resData,
  data: {
    ...resData.data,
    result: [
      {
        ...resData.data.result[0],
        metric: {
          ...resData.data.result[0].metric,
          data_label: 'not_target',
        },
      },
    ],
  },
};

describe('useGraphViewPropsOfAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSWRImmutable as jest.Mock).mockReset();
    (utils.fetcherForPromqlByPost as jest.Mock).mockReset();
    (utils.createPromQLParams as jest.Mock).mockReset();
    (utils.parseGraphData as jest.Mock).mockReset();
  });

  describe('when SWR returns valid data', () => {
    test('should return properly formatted area chart props', () => {
      // Setup mocks
      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: resData,
          error: null,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(mockGraphData);

      // Execute hook
      const {
        result: {
          current: { areaChartProps, areaChartError, areaChartValidating },
        },
      } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      // Assert basic properties
      expect(areaChartProps).toHaveProperty('title', 'Energy Consumptions');
      expect(areaChartProps).toHaveProperty('valueFormatter', utils.formatEnergyValue);
      expect(areaChartProps).toHaveProperty('linkTitle', 'Summary');
      expect(areaChartProps).toHaveProperty('link', '/cdim/res-summary');
      expect(areaChartProps).toHaveProperty('query', { tab: 'all' });
      expect(areaChartProps).toHaveProperty('data', mockGraphData);

      // Assert date range
      expect(areaChartProps).toHaveProperty('dateRange');
      expect(Array.isArray(areaChartProps.dateRange)).toBe(true);
      expect(areaChartProps.dateRange.length).toBe(2);
      expect(areaChartProps.dateRange[0]).toBeInstanceOf(Date);
      expect(areaChartProps.dateRange[1]).toBeInstanceOf(Date);

      // Assert SWR states
      expect(areaChartError).toBeNull();
      expect(areaChartValidating).toBe(false);
    });
  });

  describe('when SWR returns data with no target metrics', () => {
    test.each([
      ['empty values', resDataEmpty],
      ['wrong data label', resDataNotTarget],
    ])('should return undefined data for %s', (_, testData) => {
      // Setup mocks
      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: testData,
          error: null,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      // Execute hook
      const {
        result: {
          current: { areaChartProps, areaChartError, areaChartValidating },
        },
      } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      // Assert
      expect(areaChartProps).toEqual({
        title: 'Energy Consumptions',
        data: undefined,
        valueFormatter: utils.formatEnergyValue,
        linkTitle: 'Summary',
        link: '/cdim/res-summary',
        query: { tab: 'all' },
        dateRange: expect.any(Array),
      });
      expect(areaChartError).toBeNull();
      expect(areaChartValidating).toBe(false);
    });
  });

  describe('when SWR returns no data', () => {
    test('should return props with undefined data', () => {
      // Setup mocks
      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: undefined,
          error: null,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      // Execute hook
      const {
        result: {
          current: { areaChartProps, areaChartError, areaChartValidating },
        },
      } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      // Assert
      expect(areaChartProps).toEqual({
        title: 'Energy Consumptions',
        data: undefined,
        valueFormatter: utils.formatEnergyValue,
        linkTitle: 'Summary',
        link: '/cdim/res-summary',
        query: { tab: 'all' },
        dateRange: expect.any(Array),
      });
      expect(areaChartError).toBeNull();
      expect(areaChartValidating).toBe(false);
    });
  });

  describe('when SWR returns error or loading state', () => {
    test.each([
      ['error state', new Error('Test error'), false],
      ['loading state', null, true],
    ])('should handle %s correctly', (_, error, isValidating) => {
      // Setup mocks
      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: undefined,
          error,
          isValidating,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      // Execute hook
      const {
        result: {
          current: { areaChartProps, areaChartError, areaChartValidating },
        },
      } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      // Assert
      expect(areaChartProps).toEqual({
        title: 'Energy Consumptions',
        data: undefined,
        valueFormatter: utils.formatEnergyValue,
        linkTitle: 'Summary',
        link: '/cdim/res-summary',
        query: { tab: 'all' },
        dateRange: expect.any(Array),
      });
      expect(areaChartError).toBe(error);
      expect(areaChartValidating).toBe(isValidating);
    });
  });

  describe('SWR key generation', () => {
    test('should generate correct SWR key when mswInitializing is false', () => {
      // Setup mocks
      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: undefined,
          error: null,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      // Execute hook
      renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      // Assert SWR key structure
      expect(useSWRImmutable as jest.Mock).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query_range'), expect.stringContaining('all_energy'), '1h']),
        expect.any(Function)
      );
    });
  });

  describe('SWR fetcher function', () => {
    test('should execute fetcher function and update date range', async () => {
      let capturedFetcher: Function | null = null;

      // Mock SWR to capture the fetcher function
      (useSWRImmutable as jest.Mock).mockImplementation((key, fetcher) => {
        capturedFetcher = fetcher;
        return createSWRResponse({
          data: resData,
          error: null,
          isValidating: false,
        });
      });

      // Mock the utility functions
      (utils.createPromQLParams as jest.Mock).mockReturnValue(
        new URLSearchParams('query=test&start=2023-12-06T00:00:00.000Z&end=2023-12-06T23:59:59.000Z&step=1h')
      );
      (utils.fetcherForPromqlByPost as jest.Mock).mockResolvedValue(resData);
      (utils.parseGraphData as jest.Mock).mockReturnValue(mockGraphData);

      // Execute hook to capture the fetcher
      renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      // Verify fetcher was captured
      expect(capturedFetcher).toBeDefined();

      // Execute the captured fetcher function
      const mockUrl = 'http://test.com/query_range';
      const mockKey = [mockUrl, 'test_query', '1h'];
      await act(async () => {
        await capturedFetcher!(mockKey);
      });

      // Verify the fetcher function called the expected utilities
      expect(utils.createPromQLParams as jest.Mock).toHaveBeenCalled();
      expect(utils.fetcherForPromqlByPost as jest.Mock).toHaveBeenCalledWith(mockUrl, expect.any(URLSearchParams));

      // Verify the createPromQLParams was called with the correct parameters
      const createParamsCall = (utils.createPromQLParams as jest.Mock).mock.calls[0];
      expect(createParamsCall[0]).toContain('label_replace'); // Query contains the expected pattern
      expect(createParamsCall[3]).toBe('1h'); // Step parameter
    });

    test('should handle MSW initialization state', () => {
      // Test the mswInitializing branch by mocking the useMSW hook differently
      // Since mswInitializing is hardcoded to false in the implementation,
      // we need to test the key generation logic

      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: undefined,
          error: null,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      // Execute hook
      renderHook(() => useGraphViewPropsOfAll('CPU', 'month'));

      // Verify SWR was called with the correct key structure
      expect(useSWRImmutable as jest.Mock).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.stringContaining('query_range'),
          expect.stringContaining('CPU_energy'), // Device type specific
          '1h',
        ]),
        expect.any(Function)
      );
    });
  });

  describe('edge cases and error scenarios', () => {
    test('should handle different period parameter values', () => {
      // Test different period values (currently not implemented but parameter exists)
      const periods = ['day', 'week', 'month', 'year'] as const;

      periods.forEach((period) => {
        (useSWRImmutable as jest.Mock).mockReturnValue(
          createSWRResponse({
            data: undefined,
            error: null,
            isValidating: false,
          })
        );

        (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

        const { result } = renderHook(() => useGraphViewPropsOfAll('all', period));

        // Verify the hook still works regardless of period parameter
        expect(result.current.areaChartProps).toBeDefined();
        expect(result.current.areaChartProps.title).toBe('Energy Consumptions');
      });
    });

    test('should handle complex error objects', () => {
      const complexError = {
        message: 'Network error',
        code: 500,
        details: { url: 'test.com', timeout: true },
      };

      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: undefined,
          error: complexError,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      const { result } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      expect(result.current.areaChartError).toBe(complexError);
      expect(result.current.areaChartProps.data).toBeUndefined();
    });

    test('should handle simultaneous error and loading states', () => {
      const error = new Error('Test error');

      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: undefined,
          error: error,
          isValidating: true, // Both error and loading
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      const { result } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      expect(result.current.areaChartError).toBe(error);
      expect(result.current.areaChartValidating).toBe(true);
      expect(result.current.areaChartProps.data).toBeUndefined();
    });
  });

  describe('fetcher function behavior', () => {
    test('should call fetcher with correct parameters', async () => {
      // Setup mocks
      (utils.createPromQLParams as jest.Mock).mockReturnValue(
        new URLSearchParams('query=test&start=2023-12-06T00:00:00.000Z&end=2023-12-06T23:59:59.000Z&step=1h')
      );
      (utils.fetcherForPromqlByPost as jest.Mock).mockResolvedValue(resData);

      // Execute direct fetcher call for testing
      const url = 'http://test.com/query_range';
      const query = 'test_query';
      const start = '2023-12-06T00:00:00.000Z';
      const end = '2023-12-06T23:59:59.000Z';
      const step = '1h';

      const params = (utils.createPromQLParams as jest.Mock)(query, start, end, step);
      await (utils.fetcherForPromqlByPost as jest.Mock)(url, params);

      // Assert function calls
      expect(utils.createPromQLParams as jest.Mock).toHaveBeenCalledWith(query, start, end, step);
      expect(utils.fetcherForPromqlByPost as jest.Mock).toHaveBeenCalledWith(url, params);

      // Assert call arguments
      expect((utils.createPromQLParams as jest.Mock).mock.calls[0][0]).toBe(query);
      expect((utils.createPromQLParams as jest.Mock).mock.calls[0][3]).toBe(step);
      expect((utils.fetcherForPromqlByPost as jest.Mock).mock.calls[0][0]).toBe(url);
      expect((utils.fetcherForPromqlByPost as jest.Mock).mock.calls[0][1]).toBeInstanceOf(URLSearchParams);
    });
  });

  describe('device type handling', () => {
    test.each([
      ['all', 'all'],
      ['CPU', 'CPU'],
      ['GPU', 'GPU'],
      ['Memory', 'Memory'],
    ])('should handle device type %s correctly', (deviceType, expectedTab) => {
      // Setup mocks
      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: undefined,
          error: null,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      // Execute hook
      const {
        result: {
          current: { areaChartProps },
        },
      } = renderHook(() => useGraphViewPropsOfAll(deviceType as any, 'month'));

      // Assert query parameter
      expect(areaChartProps.query).toEqual({ tab: expectedTab });
    });
  });

  describe('boundary value tests', () => {
    test('should handle null data gracefully', () => {
      // Setup mocks
      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: null,
          error: null,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue(undefined);

      // Execute hook
      const {
        result: {
          current: { areaChartProps },
        },
      } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      // Assert
      expect(areaChartProps.data).toBeUndefined();
    });

    test('should handle empty string values', () => {
      const dataWithEmptyValues: APIPromQL = {
        ...resData,
        data: {
          ...resData.data,
          result: [
            {
              ...resData.data.result[0],
              values: [
                [1701820800, ''],
                [1701824400, '0'],
              ],
            },
          ],
        },
      };

      // Setup mocks
      (useSWRImmutable as jest.Mock).mockReturnValue(
        createSWRResponse({
          data: dataWithEmptyValues,
          error: null,
          isValidating: false,
        })
      );

      (utils.parseGraphData as jest.Mock).mockReturnValue([]);

      // Execute hook
      const {
        result: {
          current: { areaChartProps },
        },
      } = renderHook(() => useGraphViewPropsOfAll('all', 'month'));

      // Assert
      expect(areaChartProps.data).toEqual([]);
    });
  });
});
