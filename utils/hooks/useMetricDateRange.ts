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

import dayjs from 'dayjs';

/**
 * A custom hook that takes a date range and returns a tuple of ISO string dates
 * suitable for metric queries. If the provided dates are invalid, it defaults
 * to the last 24 hours.
 *
 * - The start date defaults to 24 hours ago if invalid.
 * - The end date defaults to now if invalid.
 * - If the end date is today, it returns the current time (with seconds and milliseconds set to zero).
 * - Otherwise, it returns the start of the next day after the end date.
 *
 * @param dateRange - A tuple containing the start and end dates as `Date` objects.
 * @returns A tuple of ISO string dates: `[metricStartDate, metricEndDate]`.
 */
export const useMetricDateRange = (dateRange: [Date, Date]): [string, string] => {
  const [from, to] = dateRange;
  const now = dayjs();

  // Validate and get start date, default to 24 hours ago if invalid
  let startDate = dayjs(from);
  if (!startDate.isValid()) {
    startDate = now.subtract(24, 'hour');
  }

  // Validate and get end date, default to now if invalid
  let endDate = dayjs(to);
  if (!endDate.isValid()) {
    endDate = now;
  }

  const metricStartDate = startDate.toISOString();
  const metricEndDate = endDate.isSame(now, 'day')
    ? now.second(0).millisecond(0).toISOString()
    : endDate.add(1, 'day').startOf('day').toISOString();

  return [metricStartDate, metricEndDate];
};
