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

import { NumberRange } from '@/shared-modules/components';
import { DateRange } from '@/shared-modules/types';

/**
 * Checks if a target date falls within a given date range.
 * @param query - The date range to check against.
 * @param target - The target date to check.
 * @returns True if query is empty or the target date is within the date range, false otherwise.
 */
export const isDateInRange = (target: Date | undefined, query: DateRange) => {
  const FROM = 0;
  const TO = 1;

  if (query.every((date) => date === undefined || date === null)) return true;

  if (target === undefined) return false;

  const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const fromDate = getDateWithoutMilliseconds(query[FROM]);
  const toDate = getDateWithoutMilliseconds(query[TO]);

  if (fromDate === undefined && toDate !== undefined) return targetDate <= toDate;
  if (toDate === undefined && fromDate !== undefined) return fromDate <= targetDate;
  if (fromDate !== undefined && toDate !== undefined) return fromDate <= targetDate && targetDate <= toDate;
};

const getDateWithoutMilliseconds = (val: Date | undefined | null): Date | undefined => {
  return val ? new Date(val.getFullYear(), val.getMonth(), val.getDate()) : undefined;
};

/**
 * Checks if all space-separated terms in the query string are included in the given value.
 *
 * @param val - The string to be checked against the query. If undefined, the function returns false.
 * @param query - The space-separated query string containing terms to be checked.
 * @returns `true` if all terms in the query are found in the value (case-insensitive), or if the query is empty.
 *          `false` if the value is undefined or any term in the query is not found in the value.
 */
export const isAllStringIncluded = (val: string | undefined, query: string): boolean => {
  // if query is empty, do not filter
  if (query.trim() === '') return true;
  // if query is not empty, record whose value is empty should be filtered
  if (val === undefined) return false;

  return query
    .trim()
    .split(' ')
    .every((id) => val.toLowerCase().includes(id.toLowerCase()));
};

/**
 * Checks if a given number is within a specified range.
 *
 * @param val - The number to check. If undefined, the function returns false if the range is not empty.
 * @param query - An array representing the range [min, max]. If both elements are undefined, the function returns true.
 *
 * @returns A boolean indicating whether the number is within the range.
 */
export const isNumberInRange = (val: number | undefined, query: NumberRange): boolean => {
  // if query is empty, do not filter
  if (query.every((v) => v === undefined)) return true;
  // if query is not empty, record whose value is empty should be filtered
  if (val === undefined) return false;

  return (query[0] === undefined || val >= query[0]) && (query[1] === undefined || val <= query[1]);
};

/**
 * Checks if any number in the given array falls within the specified range.
 *
 * @param val - An array of numbers to check. If undefined or empty, the function returns false.
 * @param query - A tuple representing the range [min, max]. If both elements are undefined, the function returns true.
 * @returns `true` if any number in the array is within the range specified by the query, otherwise `false`.
 */
export const isNumbersInRange = (val: number[] | undefined, query: NumberRange): boolean => {
  // if query is empty, do not filter
  if (query.every((v) => v === undefined)) return true;
  // if query is not empty, record whose value is empty should be filtered
  if (val === undefined || val.length === 0) return false;

  return val.some((v) => (query[0] === undefined || v >= query[0]) && (query[1] === undefined || v <= query[1]));
};

/**
 * Checks if a given value is selected based on a query array.
 *
 * @param val - The value to check. It can be a string or undefined.
 * @param query - An array of strings representing the query. If the array is empty, the function returns true.
 * @returns A boolean indicating whether the value is selected. Returns true if the query array is empty,
 *          false if the value is undefined, or true if the value matches any element in the query array.
 */
export const isSelected = (val: string | undefined, query: string[]): boolean => {
  // if query is empty, do not filter
  if (query.length === 0) return true;
  if (val === undefined) return false;
  // OR filtering
  return query.some((q) => q === val);
};

/**
 * Checks if any value in the given array is selected based on a query array.
 *
 * @param val - An array of strings to check. If undefined or empty, the function returns false.
 * @param query - An array of strings representing the query. If the array is empty, the function returns true.
 * @returns `true` if query is zero or any value in the array is selected based on the query array, otherwise `false`.
 */
export const isAnyValueSelected = (val: string[] | undefined, query: string[]): boolean => {
  // if query is empty, do not filter
  if (query.length === 0) return true;
  if (val === undefined || val.length === 0) return false;
  // OR filtering
  return val.some((v) => query.includes(v));
};

/**
 * Checks if a given value is selected based on a query array.
 *
 * @param val - The value to check. It can be a number or undefined.
 * @param query - An array of strings representing the query. If the array is empty, the function returns true.
 * @returns A boolean indicating whether the value is selected. Returns true if the query array is empty,
 *          false if the value is undefined, or true if the value matches any condition in the query array.
 */
export const isExistanceSelected = (val: number | undefined, query: ('exist' | 'notExist')[]): boolean => {
  if (query.length === 0) return true;
  if (val === undefined) return false;

  if (query.includes('notExist') && query.includes('exist')) return true;

  if (query.includes('notExist')) return val === 0;
  else return val > 0;
};
