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

import { useLocale } from 'next-intl';

type dateFormat = 'full' | 'date' | 'time';

/**
 * Returns a localized date string based on the provided date and format.
 * @param date - The date object to format. If undefined, the current date will be used.
 * @param format - The format of the date string. Possible values are 'date', 'time', and 'full'.
 * @returns The localized date string.
 */
export const useLocaleDateString = (
  date: Date | undefined,
  format: dateFormat = 'full'
): string => {
  const locale = useLocale();
  const d: Date = date ? date : new Date();
  switch (format) {
    case 'date':
      return d.toLocaleDateString(locale);
    case 'time':
      return d.toLocaleTimeString(locale);
    case 'full':
    default:
      return d.toLocaleString(locale);
  }
};
