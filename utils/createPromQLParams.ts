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
 * Creates URLSearchParams for PromQL query_range API requests.
 *
 * @param query - The PromQL query string
 * @param metricStartDate - The start date for the query range (ISO string or undefined)
 * @param metricEndDate - The end date for the query range (ISO string or undefined)
 * @param step - The step interval for the query (e.g., '1h', '5m')
 * @returns URLSearchParams object ready for API requests
 */
export const createPromQLParams = (
  query: string,
  metricStartDate: string | undefined,
  metricEndDate: string | undefined,
  step: string
): URLSearchParams => {
  const params: Record<string, string> = {
    query,
    start: metricStartDate ?? '',
    end: metricEndDate ? (dayjs(metricEndDate).isSame(dayjs(), 'day') ? new Date().toISOString() : metricEndDate) : '',
    step,
  };
  return new URLSearchParams(params);
};
