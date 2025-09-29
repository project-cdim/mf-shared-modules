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

import { DECIMAL_PLACES, KB, KIB } from '../constant';

const SI_PREFIX = ['y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

const BINARY_PREFIX = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi'];

/**
 * Returns a value formatted according to the given SI prefix
 *
 * @param value The number to be converted (as a string)
 * @param prefix SI prefix
 * @returns The converted number (as a string)
 */
export const formatBySiPrefix = (value: number, prefix: string): string => {
  // if (value < 0) return '';

  const index = SI_PREFIX.indexOf(prefix);

  if (index === -1) {
    return '';
  } else if (index < 8) {
    return (value * KB ** (8 - index)).toFixed(DECIMAL_PLACES);
  } else if (index === 8) {
    // Up to the second decimal place is displayed, so the third decimal place and below are truncated. ex) 1.001 -> 1.00
    const n = Math.floor(value * 100) / 100;
    return Number.isInteger(n) ? n.toString() : n.toFixed(DECIMAL_PLACES);
  } else {
    return (value / KB ** (index - 8)).toFixed(DECIMAL_PLACES);
  }
};

/**
 * Returns a number formatted according to the given binary prefix
 *
 * @param value The number to be converted (as a string)
 * @param prefix Binary prefix
 * @returns The converted number (as a string)
 */
export const formatByBinaryPrefix = (value: number, prefix: string): string => {
  if (value < 0) return '';

  const index = BINARY_PREFIX.indexOf(prefix);

  if (index === -1) {
    return '';
  }
  if (index === 0) {
    // Up to the second decimal place is displayed, so the third decimal place and below are truncated. ex) 1.001 -> 1.00
    const n = Math.floor(value * 100) / 100;
    return Number.isInteger(n) ? n.toString() : n.toFixed(DECIMAL_PLACES);
  } else {
    return (value / KIB ** index).toFixed(DECIMAL_PLACES);
  }
};
/**
 * Return the appropriate binary prefix for the given number (string)
 *
 * @param value number(string)
 * @returns binary prefix
 */
export const valueToBinaryPrefix = (value: number): string => {
  if (Number.isNaN(value) || value <= 0) {
    return '';
  }
  const logNum = Math.log2(value);
  const unitIndex = Math.floor(logNum / 10);
  /** If the index is out of range, return an empty string */
  return BINARY_PREFIX[unitIndex] || '';
};

/**
 * Returns the appropriate SI prefix for the given number (string)
 *
 * @param value number (string)
 * @returns SI prefix
 */
export const valueToSiPrefix = (value: number): string => {
  if (Number.isNaN(value)) {
    return '';
  }

  const logNum = Math.log10(Math.abs(value));
  const unitIndex = Math.floor(logNum / 3) + 8;
  /** If the index is out of range, return an empty string */
  return SI_PREFIX[unitIndex] || '';
};

export const formatBytesValue = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '- B';
  const binaryPrefix = valueToBinaryPrefix(value);
  const valStr = formatByBinaryPrefix(value, binaryPrefix);
  return binaryPrefix ? `${valStr} ${binaryPrefix}B` : `${valStr} B`;
};

export const formatEnergyValue = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '- Wh';
  const siPrefix = valueToSiPrefix(value);
  return `${formatBySiPrefix(value, siPrefix)} ${siPrefix}Wh`;
};

export const formatNetworkTransferValue = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '- bit/s';

  const networkPrefix = valueToBinaryPrefix(value);
  const valStr = formatByBinaryPrefix(value, networkPrefix);
  return networkPrefix ? `${valStr} ${networkPrefix}b/s` : `${valStr} bit/s`;
};

export const formatPercentValue = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '- %';
  return `${value.toFixed(DECIMAL_PLACES)} %`;
};

/**
 * Formats a number using the Intl.NumberFormat API.
 *
 * @param number - The number to format.
 * @returns The formatted number as a string.
 */
export const formatNumberOfResources = (value: number): string => {
  if (value === 1) return '1 resource';
  else return `${Intl.NumberFormat().format(value).toString()} resources`;
};

export const signOfTheNumber = (value: number | undefined | null): string => {
  if (value == null) {
    return '';
  }

  if (value > 0) {
    return '+';
  } else if (value === 0) {
    return '±';
  }

  return '';
};
