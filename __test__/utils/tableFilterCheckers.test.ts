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
  isAllStringIncluded,
  isDateInRange,
  isNumberInRange,
  isNumbersInRange,
  isSelected,
  isAnyValueSelected,
  isExistanceSelected,
} from '@/shared-modules/utils/tableFilterCheckers';

describe('isDateInRange', () => {
  const defaultProps: { query: Parameters<typeof isDateInRange>[1]; target: Parameters<typeof isDateInRange>[0] } = {
    query: [new Date(2024, 1, 1), new Date(2024, 12, 31)],
    target: new Date(2024, 6, 15),
  };

  test('returns true when target date is within the range', () => {
    expect(isDateInRange(defaultProps.target, defaultProps.query)).toBe(true);
  });

  test('returns false when target date is undefined', () => {
    const overWriteProps: Partial<typeof defaultProps> = { target: undefined };
    const mergedProps = { ...defaultProps, ...overWriteProps };
    expect(isDateInRange(mergedProps.target, mergedProps.query)).toBe(false);
  });

  test('returns true when both dates in query are undefined', () => {
    const overWriteProps: Partial<typeof defaultProps> = { query: [undefined, undefined] };
    const mergedProps = { ...defaultProps, ...overWriteProps };
    expect(isDateInRange(mergedProps.target, mergedProps.query)).toBe(true);
  });

  test('returns true when target date is equal to the start date of the range', () => {
    const overWriteProps: Partial<typeof defaultProps> = { target: new Date(2024, 1, 1) };
    const mergedProps = { ...defaultProps, ...overWriteProps };
    expect(isDateInRange(mergedProps.target, mergedProps.query)).toBe(true);
  });

  test('returns true when target date is equal to the end date of the range', () => {
    const overWriteProps: Partial<typeof defaultProps> = { target: new Date(2024, 12, 31) };
    const mergedProps = { ...defaultProps, ...overWriteProps };
    expect(isDateInRange(mergedProps.target, mergedProps.query)).toBe(true);
  });

  test('returns false when target date is before the start date of the range', () => {
    const overWriteProps: Partial<typeof defaultProps> = { target: new Date(2023, 12, 31) };
    const mergedProps = { ...defaultProps, ...overWriteProps };
    expect(isDateInRange(mergedProps.target, mergedProps.query)).toBe(false);
  });

  test('returns false when target date is after the end date of the range', () => {
    const overWriteProps: Partial<typeof defaultProps> = { target: new Date(2025, 1, 1) };
    const mergedProps = { ...defaultProps, ...overWriteProps };
    expect(isDateInRange(mergedProps.target, mergedProps.query)).toBe(false);
  });

  test('returns true when only start date is defined and target date is after start date', () => {
    const overWriteProps: Partial<typeof defaultProps> = { query: [new Date(2024, 1, 1), undefined] };
    const mergedProps = { ...defaultProps, ...overWriteProps };
    expect(isDateInRange(mergedProps.target, mergedProps.query)).toBe(true);
  });

  test('returns true when only end date is defined and target date is before end date', () => {
    const overWriteProps: Partial<typeof defaultProps> = { query: [undefined, new Date(2024, 12, 31)] };
    const mergedProps = { ...defaultProps, ...overWriteProps };
    expect(isDateInRange(mergedProps.target, mergedProps.query)).toBe(true);
  });
});

describe('isAllStringIncluded', () => {
  test('returns true when query is empty', () => {
    expect(isAllStringIncluded('test', '')).toBe(true);
  });

  test('returns false when value is undefined', () => {
    expect(isAllStringIncluded(undefined, 'test')).toBe(false);
  });

  test('returns true when all query strings are included in value', () => {
    expect(isAllStringIncluded('this is a test string', 'test string')).toBe(true);
  });

  test('returns false when not all query strings are included in value', () => {
    expect(isAllStringIncluded('this is a test string', 'test missing')).toBe(false);
  });
});

describe('isNumberInRange', () => {
  test('returns true when query is empty', () => {
    expect(isNumberInRange(5, [undefined, undefined])).toBe(true);
  });

  test('returns false when value is undefined', () => {
    expect(isNumberInRange(undefined, [1, 10])).toBe(false);
  });

  test('returns true when value is within range', () => {
    expect(isNumberInRange(5, [1, 10])).toBe(true);
  });

  test('returns false when value is outside range', () => {
    expect(isNumberInRange(15, [1, 10])).toBe(false);
  });
});

describe('isNumbersInRange', () => {
  test('returns true when query is empty', () => {
    expect(isNumbersInRange([5, 10], [undefined, undefined])).toBe(true);
  });

  test('returns false when value is undefined', () => {
    expect(isNumbersInRange(undefined, [1, 10])).toBe(false);
  });

  test('returns true when at least one number is within range', () => {
    expect(isNumbersInRange([5, 15], [1, 10])).toBe(true);
  });

  test('returns false when no numbers are within range', () => {
    expect(isNumbersInRange([15, 20], [1, 10])).toBe(false);
  });
});

describe('isSelected', () => {
  test('returns true when query is empty', () => {
    expect(isSelected('test', [])).toBe(true);
  });

  test('returns false when value is undefined', () => {
    expect(isSelected(undefined, ['test'])).toBe(false);
  });

  test('returns true when value is in query', () => {
    expect(isSelected('test', ['test', 'example'])).toBe(true);
  });

  test('returns false when value is not in query', () => {
    expect(isSelected('missing', ['test', 'example'])).toBe(false);
  });
});

describe('isAnyValueSelected', () => {
  test('returns true when query is empty', () => {
    expect(isAnyValueSelected(['test'], [])).toBe(true);
  });

  test('returns false when value is undefined', () => {
    expect(isAnyValueSelected(undefined, ['test'])).toBe(false);
  });

  test('returns true when at least one value is in query', () => {
    expect(isAnyValueSelected(['test', 'example'], ['test', 'example'])).toBe(true);
  });

  test('returns false when no value is in query', () => {
    expect(isAnyValueSelected(['missing'], ['test', 'example'])).toBe(false);
  });
});

describe('isExistanceSelected', () => {
  test.each([undefined, 0, 1, 100])('returns true when query is empty', (val) => {
    expect(isExistanceSelected(val, [])).toBe(true);
  });

  test.each([['exist'], ['notExist'], ['exist', 'notExist']])(
    'returns false when query is not empty  and value is undefined',
    // @ts-ignore
    (query: ('exist' | 'notExist')[]) => {
      expect(isExistanceSelected(undefined, query)).toBe(false);
    }
  );

  test.each([0, 1, 100])('returns true when query contains both exist and notExist and value is number', (val) => {
    expect(isExistanceSelected(val, ['exist', 'notExist'])).toBe(true);
  });

  test('returns true when query contains only notExist and value is 0', () => {
    expect(isExistanceSelected(0, ['notExist'])).toBe(true);
  });

  test.each([1, 100])('returns false when query contains only notExist and value is not 0', (val) => {
    expect(isExistanceSelected(val, ['notExist'])).toBe(false);
  });

  test.each([1, 100])('returns true when query contains only exist and value is not 0', (val) => {
    expect(isExistanceSelected(val, ['exist'])).toBe(true);
  });

  test('returns false when query contains only exist and value is 0', () => {
    expect(isExistanceSelected(0, ['exist'])).toBe(false);
  });
});
