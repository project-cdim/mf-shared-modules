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

import { screen } from '@testing-library/react';
import { useLocale } from 'next-intl';

import { render } from '@/shared-modules/__test__/test-utils';

import { DatetimeString } from '@/shared-modules/components';

describe('DatetimeString', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
  });

  test('Should display date and time in ja locale', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('ja');

    const date = new Date('2023-05-10T10:20:30Z');
    render(<DatetimeString date={date} />);

    expect(screen.getByText('2023/5/10 10:20:30')).toBeInTheDocument();
  });

  test('Should display date and time in en locale', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('en');

    const date = new Date('2023-05-10T10:20:30Z');
    render(<DatetimeString date={date} />);

    expect(screen.getByText('5/10/2023, 10:20:30 AM')).toBeInTheDocument();
  });

  test('Should display nothing when date is undefined', () => {
    (useLocale as unknown as jest.Mock).mockReturnValue('ja');

    render(<DatetimeString />);

    expect(screen.queryByText('2023/5/10 10:20:30')).not.toBeInTheDocument();
  });
});
