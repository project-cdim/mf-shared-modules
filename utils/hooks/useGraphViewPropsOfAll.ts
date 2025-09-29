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

import { useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { GraphViewProps } from '@/shared-modules/components';
import { APIDeviceType, APIPromQL } from '@/shared-modules/types';
import { fetcherForPromqlByPost, formatEnergyValue, parseGraphData, createPromQLParams } from '@/shared-modules/utils';
import { useMetricDateRange } from './useMetricDateRange';
// import { useMSW } from './useMSW';

/**
 * Get date range for one month ago to current time
 * @returns [Date, Date] - [oneMonthAgo, today]
 */
const getOneMonthDateRange = (): [Date, Date] => {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  oneMonthAgo.setMinutes(0, 0, 0);
  return [oneMonthAgo, today];
};

/**
 * Custom hook for retrieving energy area chart data.
 * @returns An object containing the area chart properties, error status, and validation status.
 */
export const useGraphViewPropsOfAll = (
  deviceType: 'all' | APIDeviceType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  period: 'day' | 'week' | 'month' | 'year' // TODO: implement period
) => {
  // const mswInitializing = useMSW();
  const mswInitializing = false; // Do not use MSW

  const t = useTranslations();
  const locale = useLocale();

  const [dateRange, setDateRange] = useState<[Date, Date]>(getOneMonthDateRange);
  const [metricStartDate, metricEndDate] = useMetricDateRange(dateRange);

  // Calculate step using getStepFromRange for consistency
  // const step = getStepFromRange(metricStartDate, metricEndDate);
  const step = '1h';

  // Total energy consumption of all device types (sum of differences) acquisition query
  const ALL_ENERGY_QUERY = `label_replace(sum(increase({__name__=~".*_metricEnergyJoules_reading",job=~".*"}[${step}])/3600),"data_label","${deviceType}_energy","","")`;

  // Create SWR key that excludes metricStartDate and metricEndDate to prevent infinite loops
  // istanbul ignore next
  const swrKey = !mswInitializing
    ? [`${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range`, ALL_ENERGY_QUERY, step]
    : null;

  // Get graph data (date range data)
  const { data, error, isValidating } = useSWRImmutable<APIPromQL>(swrKey, ([url]: [string, string, string]) => {
    // Calculate fresh date range for each fetch
    const [oneMonthAgo, today] = getOneMonthDateRange();

    // Update state for UI display
    setDateRange([oneMonthAgo, today]);

    // Use fresh dates for the API call
    const params = createPromQLParams(ALL_ENERGY_QUERY, oneMonthAgo.toISOString(), today.toISOString(), step);
    return fetcherForPromqlByPost(url, params);
  });

  const areaChartProps: GraphViewProps = {
    title: t('Energy Consumptions'),
    data: parseGraphData(data, `${deviceType}_energy`, locale, metricStartDate, metricEndDate),
    valueFormatter: formatEnergyValue,
    linkTitle: t('Summary'),
    link: '/cdim/res-summary',
    query: { tab: deviceType },
    dateRange: dateRange,
  };

  return {
    areaChartProps,
    areaChartError: error,
    areaChartValidating: isValidating,
  };
};
