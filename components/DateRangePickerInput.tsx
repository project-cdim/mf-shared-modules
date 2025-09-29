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
'use client';

import { DatePickerInput, DatesProvider } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useLocale, useTranslations } from 'next-intl';
import React, { useMemo, useState, useEffect, useRef } from 'react';

dayjs.extend(localizedFormat);

/**
 * DateRangePickerInput component allows users to select a date range for displaying data.
 *
 * @component
 * @returns The rendered DateRangePickerInput component.
 */

export type DateRangePickerInputProps = {
  value: [Date, Date];
  onChange: (range: [Date, Date]) => void;
};

const isSameDate = (a: Date, b: Date) => a.getTime() === b.getTime();
const isSameRange = (a: [Date, Date], b: [Date, Date]) => isSameDate(a[0], b[0]) && isSameDate(a[1], b[1]);

export const DateRangePickerInput = ({ value, onChange }: DateRangePickerInputProps) => {
  const currentLocale = useLocale();
  const t = useTranslations();
  const SUNDAY = 0;
  const initialValueRef = useRef<[Date, Date]>(value);
  // Use internal state to hold temporary selected values
  const [internalValue, setInternalValue] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Return format string for valueFormat prop according to locale
  const dateFormat = useMemo(() => {
    switch (currentLocale) {
      case 'ja':
        return 'YYYY/MM/DD';
      case 'en':
        return 'MM/DD/YYYY';
      // Add more locales as needed
      default:
        return 'YYYY/MM/DD';
    }
  }, [currentLocale]);

  const handleChange = (val: [Date | null, Date | null] | null) => {
    if (!val || (Array.isArray(val) && val[0] === null && val[1] === null)) {
      setInternalValue(initialValueRef.current);
      if (!isSameRange(value, initialValueRef.current)) {
        onChange(initialValueRef.current);
      }
    } else if (Array.isArray(val) && val.length === 2) {
      setInternalValue(val);
      if (val[0] instanceof Date && val[1] instanceof Date) {
        onChange([val[0], val[1]]);
      }
    }
    // Update internal state only when one side is selected
  };

  return (
    <DatesProvider settings={{ locale: currentLocale, firstDayOfWeek: 0, weekendDays: [SUNDAY] }}>
      <DatePickerInput
        /** component props */
        placeholder={t('Select Period')}
        valueFormat={dateFormat}
        type='range'
        clearable={true}
        minDate={new Date('2020-01-01')}
        maxDate={new Date()}
        value={internalValue}
        onChange={handleChange}
        allowSingleDateInRange={true}
        /** style props */
        miw={250}
      />
    </DatesProvider>
  );
};
