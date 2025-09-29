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
 * Retrieves the metric values from a PromQL API response that match the specified data label.
 *
 * @param data - The PromQL API response object, or undefined.
 * @param data_label - The label used to identify the target metric within the response.
 * @returns The metric values corresponding to the given data label, or undefined if not found.
 */
export const getTargetMetrics = (data: APIPromQL | undefined, data_label: string): APIPromQLMetrics | undefined => {
  return data?.data.result.find((result) => result.metric.data_label === data_label)?.values;
};

/**
 * Merges multiple arrays of `GraphViewData` into a single array, combining items with the same `date` property.
 *
 * For each input array, items are merged by their `date` key. If multiple items share the same date,
 * their properties are shallow-merged, with later arrays' properties overwriting earlier ones.
 *
 * @param dataArrays - An array of `GraphViewData` arrays (or `undefined`), each representing a dataset to merge.
 * @returns A single merged array of `GraphViewData`, or `undefined` if no data is provided.
 */
export const mergeMultiGraphData = (dataArrays: (GraphViewData | undefined)[]): GraphViewData | undefined => {
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
 * Parses a time step string and converts it to the equivalent number of seconds.
 *
 * The input string should be in the format of a number followed by a single unit character:
 * - 's' for seconds
 * - 'm' for minutes
 * - 'h' for hours
 * - 'd' for days
 *
 * Examples:
 * - "5m" returns 300
 * - "2h" returns 7200
 * - "1d" returns 86400
 * - "30s" returns 30
 *
 * If the input does not match the expected format, the function returns 3600 (1 hour) by default.
 *
 * @param stepStr - The time step string to parse (e.g., "5m", "2h").
 * @returns The equivalent number of seconds represented by the input string.
 */
const parseStepToSeconds = (stepStr: string): number => {
  const match = stepStr.match(/^(\d+)([smhd])$/);
  if (!match) return 3600; // default 1 hour

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    // istanbul ignore next
    default:
      return 3600;
  }
};

/**
 * Aligns the given `startDate` to match the step pattern of the data series, based on the first data point and the step interval.
 *
 * This function mutates the `startDate` object to ensure it is aligned with the step boundaries defined by `stepSecond`,
 * relative to the `firstDataDate`. The alignment ensures that the start time is consistent with the data's sampling pattern.
 *
 * @param startDate - The initial start date to be aligned. This object will be mutated.
 * @param firstDataDate - The date of the first data point in the series.
 * @param stepSecond - The interval between data points, in seconds.
 *
 * @remarks
 * - If `firstDataDate` is after `startDate`, the function moves `startDate` forward to align with the data pattern.
 * - If `firstDataDate` is before `startDate`, the function moves `startDate` backward to the nearest step boundary that includes the data.
 * - If `startDate` and `firstDataDate` are the same, no alignment is performed.
 */
const calculateStartAlignment = (startDate: Date, firstDataDate: Date, stepSecond: number): void => {
  const stepMsec = stepSecond * 1000;
  const dataTime = firstDataDate.getTime();
  const originalStartTime = startDate.getTime();

  // Calculate the time difference
  const timeDiffToData = dataTime - originalStartTime;

  if (timeDiffToData > 0) {
    // First data is after start time
    // Find the alignment offset to match the data pattern
    const alignmentOffset = timeDiffToData % stepMsec;

    // Adjust start to align with the data pattern
    if (alignmentOffset > 0) {
      startDate.setTime(originalStartTime + alignmentOffset);
    }
  } else if (timeDiffToData < 0) {
    // First data is before start time
    // Align start to match the step boundary that includes the data
    const absTimeDiff = Math.abs(timeDiffToData);
    const stepsBack = Math.ceil(absTimeDiff / stepMsec);
    const alignedStartTime = originalStartTime - stepsBack * stepMsec + (absTimeDiff % stepMsec);
    startDate.setTime(alignedStartTime);
  }
  // If timeDiffToData === 0, no alignment needed
};

/**
 * Generates a filled data array for a graph, ensuring that each time step between the start and end dates
 * is represented, filling in missing data points with blank entries for the specified categories.
 *
 * @param startDate - The starting date of the data range.
 * @param endDate - The ending date of the data range.
 * @param stepSecond - The interval in seconds between each data point.
 * @param dataMap - A map containing existing data, keyed by localized date strings.
 * @param categories - An array of graph categories to include in each data entry.
 * @param currentLanguage - The locale string used for formatting date keys.
 * @returns An array of graph view data, with missing data points filled with null values for each category.
 */
const generateFilledDataArray = (
  startDate: Date,
  endDate: Date,
  stepSecond: number,
  dataMap: Map<string, any>,
  categories: GraphCategory[],
  currentLanguage: string
): GraphViewData => {
  const filledData: GraphViewData = [];

  for (let date = startDate; date <= endDate; date.setSeconds(date.getSeconds() + stepSecond)) {
    const dateStr = date.toLocaleString(currentLanguage);
    if (dataMap.has(dateStr)) {
      filledData.push(dataMap.get(dateStr) as GraphViewData[0]);
    } else {
      const blankData: GraphViewData[0] = { date: dateStr };
      categories.forEach((key) => (blankData[key] = null));
      filledData.push(blankData);
    }
  }

  return filledData;
};

/**
 * Fills missing data points in a time series graph data array by generating entries for each time step
 * between the specified start and end dates. If a data point is missing for a given time step, it will be
 * filled with default or interpolated values as appropriate.
 *
 * @param graphViewData - The original array of graph data points to be filled. If undefined or empty, returns undefined.
 * @param start - The ISO string representing the start date/time of the desired range.
 * @param end - The ISO string representing the end date/time of the desired range.
 * @param currentLanguage - The current language code, used for localization if needed.
 * @param step - The time step interval as a string (e.g., '1h', '30m'). Defaults to '1h'.
 * @returns A new array of graph data points with missing intervals filled, or undefined if input is invalid.
 */
export const fillMissingGraphData = (
  graphViewData: GraphViewData | undefined,
  start: string | undefined,
  end: string | undefined,
  currentLanguage: string,
  step: string = '1h'
): GraphViewData | undefined => {
  if (!graphViewData || graphViewData.length === 0 || !start || !end) return undefined;

  const stepSecond = parseStepToSeconds(step);
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Check for invalid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return undefined;
  }

  // Align start date with actual data for better accuracy
  if (graphViewData.length > 0) {
    const firstDataPoint = graphViewData[0];
    const firstDataDate = new Date(firstDataPoint.date);

    if (!isNaN(firstDataDate.getTime())) {
      calculateStartAlignment(startDate, firstDataDate, stepSecond);
    }
  }

  const dataMap = new Map(graphViewData.map((item) => [item.date, item]));
  const categories = Object.keys(graphViewData[0]).filter<GraphCategory>(isGraphCategory);

  return generateFilledDataArray(startDate, endDate, stepSecond, dataMap, categories, currentLanguage);
};

/**
 * Parses raw PromQL graph data into a format suitable for graph visualization.
 *
 * @param graphData - The raw PromQL data to parse, or undefined if no data is available.
 * @param data_label - The label used to identify the target metric within the graph data.
 * @param currentLanguage - The locale string used for formatting date values.
 * @param start - The start timestamp (as a string) for the graph data range, or undefined.
 * @param end - The end timestamp (as a string) for the graph data range, or undefined.
 * @returns The parsed and formatted graph data as `GraphViewData`, or undefined if input data is missing.
 */
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
  const step = getStepFromRange(start, end);
  return fillMissingGraphData(data, start, end, currentLanguage, step);
};

/**
 * Parses a string and attempts to convert it into a number.
 *
 * Returns `null` if the input string is empty, contains only a single space or tab,
 * or if the parsed value is not a finite number (e.g., `NaN`, `Infinity`).
 *
 * @param value - The string to parse into a number.
 * @returns The parsed number, or `null` if the input is invalid or not a finite number.
 */
export const parseStringIntoNumber = (value: string): number | null => {
  if (value === '' || value === ' ' || value === '\t') return null;
  const number = Number(value);
  return isNaN(number) || !isFinite(number) ? null : number;
};

/**
 * Calculates an appropriate step interval string based on a given time range.
 *
 * The function determines the step size (e.g., '10m', '1h', '1d') such that the number of data points
 * (range divided by step) does not exceed a maximum threshold. If the input dates are invalid, missing,
 * or the range is zero/negative, a default step of '1h' is returned.
 *
 * @param start - The ISO string or date string representing the start of the range.
 * @param end - The ISO string or date string representing the end of the range.
 * @returns A string representing the step interval (e.g., '10m', '1h', '1d').
 */
export const getStepFromRange = (start: string | undefined, end: string | undefined): string => {
  if (!start || !end) return '1h';
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Check for invalid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '1h';
  }

  const diffSec = (endDate.getTime() - startDate.getTime()) / 1000;

  // If negative or zero range, return default
  if (diffSec <= 0) {
    return '1h';
  }

  const MAX_POINTS = 744;
  const allowedSteps = [
    600, // 10m
    900, // 15m
    1800, // 30m
    3600, // 1h
    7200, // 2h
    10800, // 3h
    21600, // 6h
    43200, // 12h
    86400, // 1d
    172800, // 2d
    259200, // 3d
    432000, // 5d
    604800, // 7d
    1296000, // 15d
    2592000, // 30d
  ];

  for (const stepSec of allowedSteps) {
    if (diffSec / stepSec <= MAX_POINTS) {
      return formatStep(stepSec);
    }
  }
  // Maximum step is 30d
  return '30d';
};

/**
 * Formats a duration given in seconds into a human-readable string with the largest appropriate time unit.
 *
 * - If the duration is a whole number of days, returns a string in the format `${days}d`.
 * - If the duration is a whole number of hours, returns a string in the format `${hours}h`.
 * - If the duration is a whole number of minutes, returns a string in the format `${minutes}m`.
 * - Otherwise, returns the duration in seconds in the format `${seconds}s`.
 *
 * @param sec - The duration in seconds to format.
 * @returns A formatted string representing the duration in days, hours, minutes, or seconds.
 */
export const formatStep = (sec: number): string => {
  if (sec % 86400 === 0) {
    return `${sec / 86400}d`;
  }
  if (sec % 3600 === 0) {
    return `${sec / 3600}h`;
  }
  if (sec % 60 === 0) {
    return `${sec / 60}m`;
  }
  return `${sec}s`;
};
