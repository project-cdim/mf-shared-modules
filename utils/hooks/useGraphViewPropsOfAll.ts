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

import { useMemo } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { GraphViewProps } from '@/shared-modules/components';
import { APIDeviceType, APIPromQL } from '@/shared-modules/types';
import { fetcherForPromql, formatEnergyValue, parseGraphData } from '@/shared-modules/utils';

/**
 * Custom hook for retrieving energy area chart data.
 * @returns An object containing the area chart properties, error status, and validation status.
 */
export const useGraphViewPropsOfAll = (
  deviceType: 'all' | APIDeviceType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  period: 'day' | 'week' | 'month' | 'year' // TODO: implement period
) => {
  const t = useTranslations();
  const locale = useLocale();
  // Total energy consumption of all device types (sum of differences) acquisition query
  const ALL_ENERGY_QUERY = `label_replace(sum(increase({__name__=~".*_metricEnergyJoules_reading",job=~".*"}[1h])/3600),"data_label","${deviceType}_energy","","")`;

  // Get graph data (date range data)
  const { data, error, isValidating } = useSWRImmutable<APIPromQL & { url?: string }>(
    // If we add date range info into query here, the data continue to be fetched in same date range.
    // So we add date range info into query in fetcherForPromql.
    `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range?query=${ALL_ENERGY_QUERY}`,
    fetcherForPromql
  );

  // Extract the acquisition target date and time range from the request URL
  const [startDate, endDate] = useMemo(() => {
    return getDateRangeFromQuery(data?.url);
  }, [data]);

  const areaChartProps: GraphViewProps = {
    title: t('Energy Consumptions'),
    data: parseGraphData(data, `${deviceType}_energy`, locale, startDate, endDate),
    valueFormatter: formatEnergyValue,
    linkTitle: t('Summary'),
    link: '/cdim/res-summary',
    query: { tab: deviceType },
  };

  return {
    areaChartProps,
    areaChartError: error,
    areaChartValidating: isValidating,
  };
};

/**
 * Extracts the start and end date values from the given URL query string.
 *
 * @param url - The URL query string.
 * @returns An array containing the start and end date values.
 */
const getDateRangeFromQuery = (url: string | undefined): [string | undefined, string | undefined] => {
  if (!url) return [undefined, undefined];

  const params = new URLSearchParams(url);
  const start = params.get('start') ?? undefined;
  const end = params.get('end') ?? undefined;
  return [start, end];
};
