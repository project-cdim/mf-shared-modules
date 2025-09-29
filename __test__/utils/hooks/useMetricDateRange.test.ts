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
import dayjs from 'dayjs';
import { useMetricDateRange } from '../../../utils/hooks/useMetricDateRange';

// Mock current time for consistent testing
const mockNow = dayjs('2023-03-15T12:00:00.000Z');

describe('useMetricDateRange', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow.toDate());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return metric date range strings from valid Date objects', () => {
    const startDate = new Date('2023-01-01T00:00:00.000Z');
    const endDate = new Date('2023-01-02T00:00:00.000Z');
    const dateRange: [Date, Date] = [startDate, endDate];

    const { result } = renderHook(() => useMetricDateRange(dateRange));

    expect(result.current).toEqual([
      '2023-01-01T00:00:00.000Z',
      '2023-01-03T00:00:00.000Z', // Next day start
    ]);
  });

  test('should handle end date being today - return stable time for end (minute precision)', () => {
    const startDate = new Date('2023-03-14T00:00:00.000Z');
    const endDate = new Date('2023-03-15T10:00:00.000Z'); // Today
    const dateRange: [Date, Date] = [startDate, endDate];

    const { result } = renderHook(() => useMetricDateRange(dateRange));

    expect(result.current).toEqual([
      '2023-03-14T00:00:00.000Z',
      '2023-03-15T12:00:00.000Z', // Stable time (start of minute)
    ]);
  });

  test('should handle invalid start date - default to 24 hours ago', () => {
    const invalidStartDate = new Date('invalid');
    const endDate = new Date('2023-01-02T00:00:00.000Z');
    const dateRange: [Date, Date] = [invalidStartDate, endDate];

    const { result } = renderHook(() => useMetricDateRange(dateRange));

    expect(result.current).toEqual([
      '2023-03-14T12:00:00.000Z', // 24 hours ago from mocked now
      '2023-01-03T00:00:00.000Z',
    ]);
  });

  test('should handle invalid end date - default to now', () => {
    const startDate = new Date('2023-01-01T00:00:00.000Z');
    const invalidEndDate = new Date('invalid');
    const dateRange: [Date, Date] = [startDate, invalidEndDate];

    const { result } = renderHook(() => useMetricDateRange(dateRange));

    expect(result.current).toEqual([
      '2023-01-01T00:00:00.000Z',
      '2023-03-15T12:00:00.000Z', // Stable time (start of minute)
    ]);
  });

  test('should handle both invalid dates - use defaults', () => {
    const invalidStartDate = new Date('invalid1');
    const invalidEndDate = new Date('invalid2');
    const dateRange: [Date, Date] = [invalidStartDate, invalidEndDate];

    const { result } = renderHook(() => useMetricDateRange(dateRange));

    expect(result.current).toEqual([
      '2023-03-14T12:00:00.000Z', // 24 hours ago from mocked now
      '2023-03-15T12:00:00.000Z', // Stable time (start of minute)
    ]);
  });

  test('should memoize the result when dateRange is the same', () => {
    const startDate = new Date('2023-01-01T00:00:00.000Z');
    const endDate = new Date('2023-01-02T00:00:00.000Z');
    const dateRange: [Date, Date] = [startDate, endDate];

    const { result, rerender } = renderHook(({ dateRange }) => useMetricDateRange(dateRange), {
      initialProps: { dateRange },
    });

    const firstResult = result.current;

    // Rerender with the same dateRange
    rerender({ dateRange });

    // Should return the same value (deep equal)
    expect(result.current).toEqual(firstResult);
  });

  test('should return new result when dateRange changes', () => {
    const initialDateRange: [Date, Date] = [new Date('2023-01-01T00:00:00.000Z'), new Date('2023-01-02T00:00:00.000Z')];

    const { result, rerender } = renderHook(({ dateRange }) => useMetricDateRange(dateRange), {
      initialProps: { dateRange: initialDateRange },
    });

    const firstResult = result.current;

    // Change the date range
    const newDateRange: [Date, Date] = [new Date('2023-02-01T00:00:00.000Z'), new Date('2023-02-02T00:00:00.000Z')];

    rerender({ dateRange: newDateRange });

    // Should return different result
    expect(result.current).not.toBe(firstResult);
    expect(result.current).toEqual([
      '2023-02-01T00:00:00.000Z',
      '2023-02-03T00:00:00.000Z', // Next day start
    ]);
  });

  test('should handle same dates with precision', () => {
    const sameTime = new Date('2023-01-01T12:30:45.123Z');
    const dateRange: [Date, Date] = [sameTime, sameTime];

    const { result } = renderHook(() => useMetricDateRange(dateRange));

    expect(result.current).toEqual([
      '2023-01-01T12:30:45.123Z',
      '2023-01-02T00:00:00.000Z', // Next day start since not today
    ]);
  });

  test('should handle edge case with same time being today', () => {
    const todayTime = new Date('2023-03-15T10:30:45.123Z'); // Today in mocked time
    const dateRange: [Date, Date] = [todayTime, todayTime];

    const { result } = renderHook(() => useMetricDateRange(dateRange));

    expect(result.current).toEqual([
      '2023-03-15T10:30:45.123Z',
      '2023-03-15T12:00:00.000Z', // Stable time (start of minute) since it's today
    ]);
  });

  test('should return stable time for today within the same minute', () => {
    const startDate = new Date('2023-03-14T00:00:00.000Z');
    const endDate = new Date('2023-03-15T10:00:00.000Z'); // Today
    const dateRange: [Date, Date] = [startDate, endDate];

    // First call
    const { result: result1 } = renderHook(() => useMetricDateRange(dateRange));

    // Simulate a few milliseconds passing (but still within the same minute)
    jest.setSystemTime(mockNow.add(500, 'millisecond').toDate());

    // Second call
    const { result: result2 } = renderHook(() => useMetricDateRange(dateRange));

    // Both should return the same metricEndDate (stable within the minute)
    expect(result1.current[1]).toBe(result2.current[1]);
    expect(result1.current[1]).toBe('2023-03-15T12:00:00.000Z');
  });
});
