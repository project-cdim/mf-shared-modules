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

import { DatePickerInput, DatesProvider } from '@mantine/dates';
import 'dayjs/locale/ja';
import { useTranslations } from 'next-intl';

/**
 * A custom date picker component.
 *
 * @component
 * @returns The rendered CustomDateTimePicker component.
 */
export const DatePicker = () => {
  const t = useTranslations();

  const SUNDAY = 0;

  const dateFormat = (): string | undefined => {
    return 'YYYY/MM/DD';
  };
  return (
    <DatesProvider
      settings={{ locale: 'ja', firstDayOfWeek: 0, weekendDays: [SUNDAY] }}
    >
      <DatePickerInput
        /** component props */
        placeholder={t('Select Period')}
        valueFormat={dateFormat()}
        type='range'
        clearable={true}
        disabled={true}
        /** stype props */
        miw={270}
      />
    </DatesProvider>
  );
};
