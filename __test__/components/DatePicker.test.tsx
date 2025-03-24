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

import React from 'react';

import { DatePickerInput } from '@mantine/dates';
import '@testing-library/jest-dom';

import { render } from '@/shared-modules/__test__/test-utils';
import { DatePicker } from '@/shared-modules/components';

// Create a mock of DatePickerInput
jest.mock('@mantine/dates', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/dates'),
  DatePickerInput: jest.fn(),
}));

describe('DatePicker', () => {
  test('should have correct props for DatePickerInput', () => {
    render(<DatePicker />);
    expect(jest.mocked(DatePickerInput).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        placeholder: 'Select Period',
        valueFormat: 'YYYY/MM/DD',
        type: 'range',
        clearable: true,
        disabled: true,
      })
    );
  });
});
