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

import { DatePicker } from '@mantine/dates';
import { screen } from '@testing-library/react';
import { useLocale } from 'next-intl';

import { render } from '@/shared-modules/__test__/test-utils';
import { DateRangePicker } from '@/shared-modules/components';
import { DateRange } from '@/shared-modules/types';

// Create a mock for DatePickerInput
jest.mock('@mantine/dates', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/dates'),
  DatePicker: jest.fn(),
}));

describe('DateRangePicker', () => {
  beforeEach(() => {
    (DatePicker as unknown as jest.Mock).mockReset();
    (useLocale as unknown as jest.Mock).mockReset();
  });

  test.each(['en', 'ja'])('The props of DatePicker are correct(%s)', (locale) => {
    (useLocale as unknown as jest.Mock).mockReturnValue(locale);
    const setValue = () => undefined;
    const dates: DateRange = [new Date('2020/1/1'), new Date('2024/1/1')];
    render(<DateRangePicker value={dates} setValue={setValue} close={() => undefined} />);

    expect((DatePicker as unknown as jest.Mock).mock.calls[0][0]).toEqual({
      locale: locale,
      onChange: setValue,
      type: 'range',
      value: dates,
    });
  });

  test('When the clear button is clicked, the close function is called', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('en');
    const setValue = () => undefined;
    const closeFunc = jest.fn();
    const dates: DateRange = [new Date('2020/1/1'), new Date('2024/1/1')];
    render(<DateRangePicker value={dates} setValue={setValue} close={closeFunc} />);

    screen.getByRole('button', { name: 'Clear' }).click();
    expect(closeFunc).toHaveBeenCalledTimes(1);
  });
});
