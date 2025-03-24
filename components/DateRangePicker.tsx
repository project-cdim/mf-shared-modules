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

import { Dispatch, SetStateAction } from 'react';

import { Button, Stack } from '@mantine/core';
import { DatePicker, DateValue, DatesProvider } from '@mantine/dates';
import { useLocale, useTranslations } from 'next-intl';

import { DateRange } from '@/shared-modules/types';

type Props = {
  /** The current selected date range. */
  value: DateRange;
  /** A function to update the selected date range. */
  setValue: Dispatch<SetStateAction<DateRange>>;
  /** A function to close the date range picker. */
  close: () => void;
};

/**
 * A component that allows the user to select a date range.
 *
 * @param props {@link Props}
 * @returns The DateRangePicker component.
 */
export const DateRangePicker = ({ value, setValue, close }: Props) => {
  const currentLocale = useLocale();
  const t = useTranslations();
  const SUNDAY = 0;
  return (
    <Stack>
      <DatesProvider
        settings={{
          locale: currentLocale,
          firstDayOfWeek: 0,
          weekendDays: [SUNDAY],
        }}
      >
        <DatePicker
          type='range'
          value={value as [DateValue, DateValue]}
          onChange={setValue}
          locale={currentLocale}
        />
      </DatesProvider>
      <Button
        disabled={value.every((v) => !v)}
        fullWidth
        variant='light'
        onClick={() => {
          setValue([null, null]);
          close();
        }}
      >
        {t('Clear')}
      </Button>
    </Stack>
  );
};
