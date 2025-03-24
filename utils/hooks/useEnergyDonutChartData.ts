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

import _ from 'lodash';
import useSWRImmutable from 'swr/immutable';

import { deviceTypeOrder } from '@/shared-modules/constant/deviceTypeOrder';
import { APIPromQL, APIPromQLMetrics } from '@/shared-modules/types';
import { fetcherForPromql, getTargetMetrics } from '@/shared-modules/utils';

/** Formatting data for donut chart */
export type donutChartDataType = {
  value?: number;
  name: string;
}[];

const ALL_DEVICE_TYPES = [...deviceTypeOrder];
const baseString = `label_replace(sum(increase({__name__=~"<type>_metricEnergyJoules_reading",job=~".*"}[1h])),"data_label","<type>_energy","","")`;
/** Acquisition query for total energy consumption by type (sum of differences) */
const energyQuery = ALL_DEVICE_TYPES.map((type) =>
  baseString.replace(/<type>/g, type)
).join(' or ');
/**
 * Custom hook to fetch and format data for an energy donut chart.
 * @returns An object containing the formatted donut chart data, any error that occurred during fetching, and the validation status.
 */
export const useEnergyDonutChartData = () => {
  /** Get graph data (date range data) */
  const { data, error, isValidating } = useSWRImmutable<APIPromQL>(
    // If we add date range info into query here, the data continue to be fetched in same date range.
    // So we add date range info into query in fetcherForPromql.
    `${process.env.NEXT_PUBLIC_URL_BE_PERFORMANCE_MANAGER}/query_range?query=${energyQuery}`,
    fetcherForPromql
  );

  /** Formatting data for donut chart */
  const donutChartData = parseEnergyDonutChartData(data);

  return {
    donutChartData,
    donutChartError: error,
    donutChartValidating: isValidating,
  };
};

/**
 * Calculates the sum of total consumptions from the given metrics and convert Wh.
 *
 * @param metrics - An array of APIPromQLMetrics containing the timestamps and metrics.
 * @returns The sum of total consumptions.
 */
const sumTotalConsumptions = (metrics: APIPromQLMetrics): number => {
  const sumConsumption = metrics.reduce((sum, [, metric]) => {
    const num = parseFloat(metric);
    /** If the metric is not a number, continue processing without adding it */
    return isNaN(num) ? sum : sum + num;
  }, 0);

  return sumConsumption / 3600;
};

/**
 * Parses the energy donut chart data from the given APIPromQL data.
 * @param data - The APIPromQL data to parse.
 * @returns An array of donut chart data objects.
 */
const parseEnergyDonutChartData = (
  data: APIPromQL | undefined
): donutChartDataType => {
  return ALL_DEVICE_TYPES.map((type) => {
    const metrics = getTargetMetrics(data, `${type}_energy`);
    return {
      value: metrics === undefined ? undefined : sumTotalConsumptions(metrics),
      name: _.upperFirst(type),
    };
  });
};
