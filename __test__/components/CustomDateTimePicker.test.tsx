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

import { DateTimePicker } from '@mantine/dates';
import { useLocale } from 'next-intl';

import { render } from '@/shared-modules/__test__/test-utils';
import { CustomDateTimePicker } from '@/shared-modules/components';

// Create a mock of DatePickerInput
jest.mock('@mantine/dates', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/dates'),
  DateTimePicker: jest.fn(),
}));

const mockOnChange = jest.fn();
const mockDateTimePicker = jest.fn();
describe('CustomDateTimePicker', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
  });

  test('should have correct props for DatePickerInput (locale: en)', () => {
    (DateTimePicker as unknown as jest.Mock).mockImplementation(mockDateTimePicker);

    render(
      <CustomDateTimePicker
        value={new Date('2020/11/11 12:12:12')}
        minDate={new Date('2020/11/11 1:11:11')}
        maxDate={new Date('2020/11/11 11:11:11')}
        label='test'
        onChange={mockOnChange}
      />
    );

    // @ts-expect-error not undefined
    expect(jest.mocked(DateTimePicker).mock.lastCall[0]).toEqual(
      expect.objectContaining({
        placeholder: 'test',
        miw: 180,
        valueFormat: 'M/D/YYYY, h:mm:ss A',
        clearable: true,
        withSeconds: true,
        value: new Date('2020/11/11 12:12:12'),
        minDate: new Date('2020/11/11 1:11:11'),
        maxDate: new Date('2020/11/11 11:11:11'),
        label: 'test',
        onChange: mockOnChange,
      })
    );
  });

  test('should have correct props for DatePickerInput (locale: ja)', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('ja');
    (DateTimePicker as unknown as jest.Mock).mockImplementation(mockDateTimePicker);

    render(
      <CustomDateTimePicker
        value={new Date('2020/11/11 12:12:12')}
        minDate={new Date('2020/11/11 1:11:11')}
        maxDate={new Date('2020/11/11 11:11:11')}
        label='test'
        onChange={mockOnChange}
      />
    );

    // @ts-expect-error not undefined
    expect(jest.mocked(DateTimePicker).mock.lastCall[0]).toEqual(
      expect.objectContaining({
        placeholder: 'test',
        miw: 180,
        valueFormat: 'YYYY/M/D H:mm:ss',
        clearable: true,
        withSeconds: true,
        value: new Date('2020/11/11 12:12:12'),
        minDate: new Date('2020/11/11 1:11:11'),
        maxDate: new Date('2020/11/11 11:11:11'),
        label: 'test',
        onChange: mockOnChange,
      })
    );
  });
});
