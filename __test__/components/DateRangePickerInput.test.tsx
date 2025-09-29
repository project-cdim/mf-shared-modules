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

import React, { act } from 'react';

import { DateRangePickerInput } from '@/shared-modules/components/DateRangePickerInput';
import { render } from '@/shared-modules/__test__/test-utils';
import { useLocale, useTranslations } from 'next-intl';

jest.mock('@mantine/dates', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/dates'),
  DatePickerInput: jest.fn(() => <input data-testid='mock-date-picker-input' />),
  DatesProvider: ({ children }: any) => <div data-testid='mock-dates-provider'>{children}</div>,
}));

jest.mock('next-intl', () => ({
  useLocale: jest.fn(() => 'en'),
  useTranslations: jest.fn(() => (key: string) => key),
}));

// Helper to create date range
const createDateRange = (start: string, end: string) => [new Date(start), new Date(end)] as [Date, Date];

describe('DateRangePickerInput', () => {
  // Helper test component to control value and simulate user clearing
  function ControlledTestWrapper({
    initial,
    next,
    onChange,
  }: {
    initial: [Date, Date];
    next: [Date, Date];
    onChange: (v: [Date, Date]) => void;
  }) {
    const [val, setVal] = React.useState(initial);
    React.useEffect(() => {
      setVal(next);
    }, [next]);
    return <DateRangePickerInput value={val} onChange={onChange} />;
  }
  beforeEach(() => {
    (require('@mantine/dates').DatePickerInput as jest.Mock).mockClear();
    (useLocale as jest.Mock).mockReset();
    (useTranslations as jest.Mock).mockReset();
    (useLocale as jest.Mock).mockReturnValue('en');
    (useTranslations as jest.Mock).mockReturnValue((key: string) => key);
  });

  test.each([
    ['en', 'MM/DD/YYYY'],
    ['ja', 'YYYY/MM/DD'],
    ['fr', 'YYYY/MM/DD'],
  ])('passes correct props to DatePickerInput for locale %s', (locale, expectedFormat) => {
    (useLocale as jest.Mock).mockReturnValue(locale);
    const value = createDateRange('2024-01-01', '2024-01-10');
    const onChange = jest.fn();
    render(<DateRangePickerInput value={value} onChange={onChange} />);
    const call = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls[1][0];
    expect(call.value).toEqual([new Date('2024-01-01'), new Date('2024-01-10')]);
    expect(call.onChange).toBeInstanceOf(Function);
    expect(call.valueFormat).toBe(expectedFormat);
    expect(call.placeholder).toBe('Select Period');
    expect(call.clearable).toBe(true);
    expect(call.type).toBe('range');
    expect(call.allowSingleDateInRange).toBe(true);
    expect(call.minDate).toBeInstanceOf(Date);
    expect(call.maxDate).toBeInstanceOf(Date);
    expect(call.miw).toBe(250);
  });

  test('calls onChange when both values are Date instances', () => {
    const value = createDateRange('2024-01-01', '2024-01-10');
    const onChange = jest.fn();
    render(<DateRangePickerInput value={value} onChange={onChange} />);
    const call = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls[1][0];
    // call.onChange([Date, Date])
    const newRange = [new Date('2024-01-05'), new Date('2024-01-15')];
    act(() => {
      call.onChange(newRange);
    });
    expect(onChange).toHaveBeenCalledWith(newRange);
  });

  test('calls onChange with initialValueRef.current when cleared and value differs', () => {
    // When value and initialValueRef.current differ, clearing (onChange(null)) triggers onChange with initialValueRef.current
    // Use a controlled wrapper to simulate value change and clearing
    const testOnChange = jest.fn();
    const testInitialValue = createDateRange('2023-12-01', '2023-12-10');
    const testValue = createDateRange('2024-01-02', '2024-01-11');
    render(<ControlledTestWrapper initial={testInitialValue} next={testValue} onChange={testOnChange} />);
    // The latest DatePickerInput mock call will have the updated value
    const callIdx = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls.length - 1;
    const call = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls[callIdx][0];
    act(() => {
      call.onChange(null);
    });
    expect(testOnChange).toHaveBeenCalledTimes(1);
    expect(testOnChange).toHaveBeenCalledWith(testInitialValue);
    expect(testOnChange).not.toHaveBeenCalledWith(testValue);
  });

  test('calls onChange with initialValueRef.current when cleared and value differs(endDate only)', () => {
    // When value and initialValueRef.current differ, clearing (onChange(null)) triggers onChange with initialValueRef.current
    // Use a controlled wrapper to simulate value change and clearing
    const testOnChange = jest.fn();
    const testInitialValue = createDateRange('2023-12-01', '2023-12-10');
    const testValue = createDateRange('2023-12-01', '2023-12-15');
    render(<ControlledTestWrapper initial={testInitialValue} next={testValue} onChange={testOnChange} />);
    // The latest DatePickerInput mock call will have the updated value
    const callIdx = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls.length - 1;
    const call = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls[callIdx][0];
    act(() => {
      call.onChange(null);
    });
    expect(testOnChange).toHaveBeenCalledTimes(1);
    expect(testOnChange).toHaveBeenCalledWith(testInitialValue);
    expect(testOnChange).not.toHaveBeenCalledWith(testValue);
  });

  test('does not call onChange when only start date is selected', () => {
    const value = createDateRange('2024-01-01', '2024-01-10');
    const onChange = jest.fn();
    render(<DateRangePickerInput value={value} onChange={onChange} />);
    const call = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls[1][0];
    act(() => {
      call.onChange([new Date('2024-01-01'), null]);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not call onChange when only end date is selected', () => {
    const value = createDateRange('2024-01-01', '2024-01-10');
    const onChange = jest.fn();
    render(<DateRangePickerInput value={value} onChange={onChange} />);
    const call = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls[1][0];
    act(() => {
      call.onChange([null, new Date('2024-01-15')]);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  // valueFormatの分岐はtest.eachでカバー済み

  test('handles edge case: same date selected', () => {
    const value = createDateRange('2024-01-01', '2024-01-01');
    render(<DateRangePickerInput value={value} onChange={jest.fn()} />);
    const call = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls[1][0];
    expect(call.value).toEqual([new Date('2024-01-01'), new Date('2024-01-01')]);
  });

  test('handles edge case: value is [null, null]', () => {
    // @ts-expect-error purposely passing [null, null] for edge case coverage
    render(<DateRangePickerInput value={[null, null]} onChange={jest.fn()} />);
    const call = (require('@mantine/dates').DatePickerInput as jest.Mock).mock.calls[1][0];
    expect(call.value).toEqual([null, null]);
  });
});
