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

import _ from 'lodash';

import { GraphCategory, GraphViewData, isGraphCategory } from '../components';
import { APIPromQL, APIPromQLMetrics } from '../types';

/**
 * Retrieves the target metrics from the provided data based on the specified data label.
 * @param data - The APIPromQL data object.
 * @param data_label - The data label to filter the metrics.
 * @returns Undefined or an array of APIPromQLMetrics representing the target metrics.
 */
export const getTargetMetrics = (
  data: APIPromQL | undefined,
  data_label: string
): APIPromQLMetrics | undefined => {
  return data?.data.result.find(
    (result) => result.metric.data_label === data_label
  )?.values;
};

/**
 * Merge multiple GraphView data.
 *
 * @param dataArrays Array of GraphViewData
 * @returns Merged GraphViewData
 */
export const mergeMultiGraphData = (
  dataArrays: (GraphViewData | undefined)[]
): GraphViewData | undefined => {
  const mergedDataMap = new Map();
  dataArrays.forEach((dataArray) => {
    dataArray?.forEach((item) => {
      // Get existing data based on the date key, create new if not found
      const existingData = mergedDataMap.get(item.date) || {};
      // Merge the data and put it back into the map
      mergedDataMap.set(item.date, { ...existingData, ...item });
    });
  });
  // Convert the map to an array
  return Array.from(mergedDataMap.values());
};

/**
 * Fill in the data for the date that does not exist in the GraphView data
 *
 * @param dataArrays GraphViewData array
 * @param start Acquisition start date and time (ISO 8601) // memo: It is easier to make Date an argument
 * @param end Acquisition start date and time (ISO 8601) // memo: It is easier to make Date an argument
 * @returns Merged GraphViewData data
 */
export const fillMissingGraphData = (
  graphViewData: GraphViewData | undefined,
  start: string | undefined,
  end: string | undefined,
  currentLanguage: string
  // step: string // Specify time intervals like 1/2, 1h, etc.
): GraphViewData | undefined => {
  if (!graphViewData || graphViewData.length === 0 || !start || !end)
    return undefined;
  /**  Specify time intervals 2/2 For now, the interval is fixed at 1 hour */
  const stepSecond = 1 * 60 * 60;
  const startDate = new Date(start);
  startDate.setMinutes(0, 0, 0);
  const endDate = new Date(end);
  endDate.setMinutes(0, 0, 0);
  const filledData: GraphViewData = [];
  const dataMap = new Map(graphViewData.map((item) => [item.date, item]));
  const categories = Object.keys(graphViewData[0]).filter<GraphCategory>(
    isGraphCategory
  );

  for (
    let date = startDate;
    date <= endDate;
    date.setSeconds(date.getSeconds() + stepSecond)
  ) {
    const dateStr = date.toLocaleString(currentLanguage);
    if (dataMap.has(dateStr)) {
      /** Existing date and time remain as it is */
      // filledData.push(dataMap.get(dateStr)!);
      filledData.push(dataMap.get(dateStr) as GraphViewData[0]);
    } else {
      /** Set null for each key for non-existent date and time */
      const blankData: GraphViewData[0] = { date: dateStr };
      categories.forEach((key) => (blankData[key] = null));
      filledData.push(blankData);
    }
  }
  return filledData;
};

export const parseGraphData = (
  graphData: APIPromQL | undefined,
  data_label: string,
  currentLanguage: string,
  start: string | undefined,
  end: string | undefined
): GraphViewData | undefined => {
  const targetMetrics = getTargetMetrics(graphData, data_label);
  const data = targetMetrics?.map(([timestamp, metric]: [number, string]) => ({
    date: new Date(timestamp * 1000).toLocaleString(currentLanguage),
    [_.upperFirst(data_label.split('_')[0])]: parseStringIntoNumber(metric),
  }));
  return fillMissingGraphData(data, start, end, currentLanguage);
};

export const parseStringIntoNumber = (value: string): number | null => {
  if (value === '' || value === ' ' || value === '\t') return null;
  const number = Number(value);
  return isNaN(number) || !isFinite(number) ? null : number;
};
