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

import { DateTimePicker, DatesProvider } from '@mantine/dates';
import { useLocale, useTranslations } from 'next-intl';

type Props = {
  /** The selected date and time value. */
  value: Date | undefined | null;
  /** The maximum selectable date and time. */
  maxDate?: Date | undefined;
  /** The minimum selectable date and time. */
  minDate?: Date | undefined;
  /** The label for the date and time picker. */
  label: string;
  /** The callback function to handle value changes. */
  onChange: () => void;
};

/**
 * CustomDateTimePicker component.
 *
 * @component
 * @param props {@link Props}
 * @returns The rendered CustomDateTimePicker component.
 */
export const CustomDateTimePicker = ({
  value,
  maxDate,
  minDate,
  label,
  onChange,
}: Props) => {
  const currentLocale = useLocale();
  const t = useTranslations();

  const SUNDAY = 0;

  const dateTimeFormat = (locale: string): string => {
    switch (locale) {
      case 'ja':
        return 'YYYY/M/D H:mm:ss';
      default:
        return 'M/D/YYYY, h:mm:ss A';
    }
  };

  return (
    <DatesProvider
      settings={{
        locale: currentLocale,
        firstDayOfWeek: 0,
        weekendDays: [SUNDAY],
      }}
    >
      <DateTimePicker
        {...{ value, maxDate, minDate, label, onChange }}
        placeholder={t(label)}
        miw={180}
        valueFormat={dateTimeFormat(currentLocale)}
        withSeconds
        clearable
        label={t(label)}
      />
    </DatesProvider>
  );
};
