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

import dayjs from 'dayjs';
import { createPromQLParams } from '@/shared-modules/utils/createPromQLParams';

// Mock dayjs for consistent testing
jest.mock('dayjs');
const mockDayjs = dayjs as jest.MockedFunction<typeof dayjs>;

describe('createPromQLParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create URLSearchParams with provided parameters', () => {
    const query = 'test_query';
    const metricStartDate = '2023-01-01T00:00:00.000Z';
    const metricEndDate = '2023-01-02T00:00:00.000Z';
    const step = '1h';

    // Mock dayjs to return false for isSame
    const mockInstance = {
      isSame: jest.fn().mockReturnValue(false),
    };
    mockDayjs.mockReturnValue(mockInstance as any);

    const result = createPromQLParams(query, metricStartDate, metricEndDate, step);

    expect(result.get('query')).toBe(query);
    expect(result.get('start')).toBe(metricStartDate);
    expect(result.get('end')).toBe(metricEndDate);
    expect(result.get('step')).toBe(step);
  });

  test('should handle undefined metricStartDate', () => {
    const query = 'test_query';
    const metricEndDate = '2023-01-02T00:00:00.000Z';
    const step = '1h';

    // Mock dayjs to return false for isSame
    const mockInstance = {
      isSame: jest.fn().mockReturnValue(false),
    };
    mockDayjs.mockReturnValue(mockInstance as any);

    const result = createPromQLParams(query, undefined, metricEndDate, step);

    expect(result.get('start')).toBe('');
    expect(result.get('end')).toBe(metricEndDate);
  });

  test('should handle undefined metricEndDate', () => {
    const query = 'test_query';
    const metricStartDate = '2023-01-01T00:00:00.000Z';
    const step = '1h';

    const result = createPromQLParams(query, metricStartDate, undefined, step);

    expect(result.get('start')).toBe(metricStartDate);
    expect(result.get('end')).toBe('');
  });

  test('should use current date when metricEndDate is same as today', () => {
    const query = 'test_query';
    const metricStartDate = '2023-01-01T00:00:00.000Z';
    const metricEndDate = '2023-01-02T00:00:00.000Z';
    const step = '1h';

    // Mock current date
    const mockCurrentDate = new Date('2023-01-02T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockCurrentDate);

    // Mock dayjs to return true for isSame (same day)
    const mockInstance = {
      isSame: jest.fn().mockReturnValue(true),
    };
    mockDayjs.mockReturnValue(mockInstance as any);

    const result = createPromQLParams(query, metricStartDate, metricEndDate, step);

    expect(result.get('start')).toBe(metricStartDate);
    expect(result.get('end')).toBe(mockCurrentDate.toISOString());

    jest.restoreAllMocks();
  });

  test('should handle both undefined start and end dates', () => {
    const query = 'test_query';
    const step = '1h';

    const result = createPromQLParams(query, undefined, undefined, step);

    expect(result.get('query')).toBe(query);
    expect(result.get('start')).toBe('');
    expect(result.get('end')).toBe('');
    expect(result.get('step')).toBe(step);
  });

  test('should handle null values for dates', () => {
    const query = 'test_query';
    const step = '1h';

    const result = createPromQLParams(query, null as any, null as any, step);

    expect(result.get('start')).toBe('');
    expect(result.get('end')).toBe('');
  });
});
