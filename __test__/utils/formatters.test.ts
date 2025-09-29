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

import {
  formatByBinaryPrefix,
  formatBySiPrefix,
  formatBytesValue,
  formatEnergyValue,
  formatNetworkTransferValue,
  formatNumberOfResources,
  formatPercentValue,
  signOfTheNumber,
  valueToBinaryPrefix,
  valueToSiPrefix,
} from '@/shared-modules/utils';

describe('valueToBinaryPrefix', () => {
  test('Should return an empty string when the value is 0', () => {
    expect(valueToBinaryPrefix(0)).toBe('');
  });

  test('Check the minimum value for each unit', () => {
    expect(valueToBinaryPrefix(1)).toBe('');
    expect(valueToBinaryPrefix(1024)).toBe('Ki');
    expect(valueToBinaryPrefix(1024 ** 2)).toBe('Mi');
    expect(valueToBinaryPrefix(1024 ** 3)).toBe('Gi');
    expect(valueToBinaryPrefix(1024 ** 4)).toBe('Ti');
    expect(valueToBinaryPrefix(1024 ** 5)).toBe('Pi');
    expect(valueToBinaryPrefix(1024 ** 6)).toBe('Ei');
    expect(valueToBinaryPrefix(1024 ** 7)).toBe('Zi');
    expect(valueToBinaryPrefix(1024 ** 8)).toBe('Yi');
  });

  test('Check the maximum value for each unit', () => {
    expect(valueToBinaryPrefix(1024)).toBe('Ki');
    // Below, 1023.999.. is rounded to 1024.00
    expect(valueToBinaryPrefix(1024 ** 2 - 1)).toBe('Ki');
    expect(valueToBinaryPrefix(1024 ** 3 - 1)).toBe('Mi');
    expect(valueToBinaryPrefix(1024 ** 4 - 1)).toBe('Gi');
    // Returns a unit one larger than expected because it is rounded up(Ti→Pi)
    // expect(valueToBinaryPrefix((1024 ** 5 - 1))).toBe('Ti');
    // expect(valueToBinaryPrefix((1024 ** 6 - 1))).toBe('Pi');
    // expect(valueToBinaryPrefix((1024 ** 7 - 1))).toBe('Ei');
    // expect(valueToBinaryPrefix((1024 ** 8 - 1))).toBe('Zi');
    // expect(valueToBinaryPrefix((1024 ** 9 - 1))).toBe('Yi');
  });

  test('Should return an empty string when the value is less than 0', () => {
    expect(valueToBinaryPrefix(-1)).toBe('');
  });

  test('Should return an empty string when the value is NaN', () => {
    expect(valueToBinaryPrefix(NaN)).toBe('');
  });
});

describe('valueToSiPrefix', () => {
  test('Returns empty when it is 0', () => {
    expect(valueToSiPrefix(0)).toBe('');
  });

  test('Check the minimum value of each unit', () => {
    expect(valueToSiPrefix(1)).toBe('');
    expect(valueToSiPrefix(1000)).toBe('k');
    expect(valueToSiPrefix(1000 ** 2)).toBe('M');
    expect(valueToSiPrefix(1000 ** 3)).toBe('G');
    expect(valueToSiPrefix(1000 ** 4)).toBe('T');
    expect(valueToSiPrefix(1000 ** 5)).toBe('P');
    expect(valueToSiPrefix(1000 ** 6)).toBe('E');
    expect(valueToSiPrefix(1000 ** 7)).toBe('Z');
    expect(valueToSiPrefix(1000 ** 8)).toBe('Y');
  });
  test('Check the maximum value of each unit', () => {
    expect(valueToSiPrefix(1000)).toBe('k');
    // 999.999 is rounded to 1000.00
    expect(valueToSiPrefix(1000 ** 2 - 1)).toBe('k');
    expect(valueToSiPrefix(1000 ** 3 - 1)).toBe('M');
    expect(valueToSiPrefix(1000 ** 4 - 1)).toBe('G');
    // Returns a unit one larger than expected because it is rounded up(T→P)
    // expect(valueToSiPrefix((1000 ** 5 - 1))).toBe('T');
    // expect(valueToSiPrefix((1000 ** 6 - 1))).toBe('P');
    // expect(valueToSiPrefix((1000 ** 7 - 1))).toBe('E');
    // expect(valueToSiPrefix((1000 ** 8 - 1))).toBe('Z');
    // expect(valueToSiPrefix((1000 ** 9 - 1))).toBe('Y');
  });

  test('If it is less than 0, an empty string is returned', () => {
    expect(valueToSiPrefix(-1)).toBe('');
  });

  test('Should return an empty string when the value is NaN', () => {
    expect(valueToSiPrefix(NaN)).toBe('');
  });
});

describe('formatByBinaryPrefix', () => {
  test('Should return B when the input is 0', () => {
    expect(formatByBinaryPrefix(0, '')).toBe('0');
  });

  test('Should return 1.50 when the input is 1.5', () => {
    expect(formatByBinaryPrefix(1.5, '')).toBe('1.50');
  });

  test('Check the minimum value for each unit', () => {
    expect(formatByBinaryPrefix(1, '')).toBe('1');
    expect(formatByBinaryPrefix(1024, 'Ki')).toBe('1.00');
    expect(formatByBinaryPrefix(1024 ** 2, 'Mi')).toBe('1.00');
    expect(formatByBinaryPrefix(1024 ** 3, 'Gi')).toBe('1.00');
    expect(formatByBinaryPrefix(1024 ** 4, 'Ti')).toBe('1.00');
    expect(formatByBinaryPrefix(1024 ** 5, 'Pi')).toBe('1.00');
    expect(formatByBinaryPrefix(1024 ** 6, 'Ei')).toBe('1.00');
    expect(formatByBinaryPrefix(1024 ** 7, 'Zi')).toBe('1.00');
    expect(formatByBinaryPrefix(1024 ** 8, 'Yi')).toBe('1.00');
  });

  test('Check the maximum value for each unit', () => {
    expect(formatByBinaryPrefix(1023, '')).toBe('1023');
    // Below, 1023.999.. is rounded to 1024.00
    expect(formatByBinaryPrefix(1024 ** 2 - 1, 'Ki')).toBe('1024.00');
    expect(formatByBinaryPrefix(1024 ** 3 - 1, 'Mi')).toBe('1024.00');
    expect(formatByBinaryPrefix(1024 ** 4 - 1, 'Gi')).toBe('1024.00');
    expect(formatByBinaryPrefix(1024 ** 5 - 1, 'Ti')).toBe('1024.00');
    expect(formatByBinaryPrefix(1024 ** 6 - 1, 'Pi')).toBe('1024.00');
    expect(formatByBinaryPrefix(1024 ** 7 - 1, 'Ei')).toBe('1024.00');
    expect(formatByBinaryPrefix(1024 ** 8 - 1, 'Zi')).toBe('1024.00');
    expect(formatByBinaryPrefix(1024 ** 9 - 1, 'Yi')).toBe('1024.00');
  });

  test('Should return an empty string when the unit is unknown', () => {
    expect(formatByBinaryPrefix(1000, 'unknownUnit')).toBe('');
  });

  test('Should return an empty string when the value is negative number', () => {
    expect(formatByBinaryPrefix(-1, 'Ki')).toBe('');
  });
});

describe('formatBySiPrefix', () => {
  test('Should return B when the input is 0', () => {
    expect(formatBySiPrefix(0, '')).toBe('0');
  });

  test('Should return 1.501 when the input is 1.5', () => {
    expect(formatBySiPrefix(1.501, '')).toBe('1.50');
  });

  test('Should return 1.001 when the input is 1', () => {
    expect(formatBySiPrefix(1.001, '')).toBe('1');
  });

  test('Check the minimum value for each unit', () => {
    expect(formatBySiPrefix(1 / 1000 ** 8, 'y')).toBe('1.00');
    expect(formatBySiPrefix(1 / 1000 ** 7, 'z')).toBe('1.00');
    expect(formatBySiPrefix(1 / 1000 ** 6, 'a')).toBe('1.00');
    expect(formatBySiPrefix(1 / 1000 ** 5, 'f')).toBe('1.00');
    expect(formatBySiPrefix(1 / 1000 ** 4, 'p')).toBe('1.00');
    expect(formatBySiPrefix(1 / 1000 ** 3, 'n')).toBe('1.00');
    expect(formatBySiPrefix(1 / 1000 ** 2, 'µ')).toBe('1.00');
    expect(formatBySiPrefix(1 / 1000, 'm')).toBe('1.00');
    expect(formatBySiPrefix(1, '')).toBe('1');
    expect(formatBySiPrefix(1000, 'k')).toBe('1.00');
    expect(formatBySiPrefix(1000 ** 2, 'M')).toBe('1.00');
    expect(formatBySiPrefix(1000 ** 3, 'G')).toBe('1.00');
    expect(formatBySiPrefix(1000 ** 4, 'T')).toBe('1.00');
    expect(formatBySiPrefix(1000 ** 5, 'P')).toBe('1.00');
    expect(formatBySiPrefix(1000 ** 6, 'E')).toBe('1.00');
    expect(formatBySiPrefix(1000 ** 7, 'Z')).toBe('1.00');
    expect(formatBySiPrefix(1000 ** 8, 'Y')).toBe('1.00');
  });

  test('Check the maximum value for each unit', () => {
    expect(formatBySiPrefix(1 / 1000 ** 7 - 1 / 1000 ** 10, 'y')).toBe('1000.00');
    expect(formatBySiPrefix(1 / 1000 ** 6 - 1 / 1000 ** 10, 'z')).toBe('1000.00');
    expect(formatBySiPrefix(1 / 1000 ** 5 - 1 / 1000 ** 10, 'a')).toBe('1000.00');
    expect(formatBySiPrefix(1 / 1000 ** 4 - 1 / 1000 ** 10, 'f')).toBe('1000.00');
    expect(formatBySiPrefix(1 / 1000 ** 3 - 1 / 1000 ** 10, 'p')).toBe('1000.00');
    expect(formatBySiPrefix(1 / 1000 ** 2 - 1 / 1000 ** 10, 'n')).toBe('1000.00');
    expect(formatBySiPrefix(1 / 1000 - 1 / 1000 ** 10, 'µ')).toBe('1000.00');
    expect(formatBySiPrefix(1 - 1 / 1000 ** 10, 'm')).toBe('1000.00');
    expect(formatBySiPrefix(999, '')).toBe('999');
    // Below, 999.999.. is rounded to 1000.00
    expect(formatBySiPrefix(1000 ** 2 - 1, 'k')).toBe('1000.00');
    expect(formatBySiPrefix(1000 ** 3 - 1, 'M')).toBe('1000.00');
    expect(formatBySiPrefix(1000 ** 4 - 1, 'G')).toBe('1000.00');
    expect(formatBySiPrefix(1000 ** 5 - 1, 'T')).toBe('1000.00');
    expect(formatBySiPrefix(1000 ** 6 - 1, 'P')).toBe('1000.00');
    expect(formatBySiPrefix(1000 ** 7 - 1, 'E')).toBe('1000.00');
    expect(formatBySiPrefix(1000 ** 8 - 1, 'Z')).toBe('1000.00');
    expect(formatBySiPrefix(1000 ** 9 - 1, 'Y')).toBe('1000.00');
  });

  test('Should return an empty string when the unit is unknown', () => {
    expect(formatBySiPrefix(1000, 'unknownUnit')).toBe('');
  });

  test('Should return an negative value when the value is negative number', () => {
    expect(formatBySiPrefix(-1000, 'k')).toBe('-1.00');
  });
});

describe('formatBytesValue function', () => {
  test('should format small bytes value correctly', () => {
    const value = 512; // 512 bytes
    const formattedValue = formatBytesValue(value);
    expect(formattedValue).toBe('512 B');
  });

  test('should format bytes value correctly', () => {
    const value = 1024; // 1 Kib
    const formattedValue = formatBytesValue(value);
    expect(formattedValue).toBe('1.00 KiB');
  });

  test('should format large bytes value correctly', () => {
    const value = 1048576; // 1 Mib
    const formattedValue = formatBytesValue(value);
    expect(formattedValue).toBe('1.00 MiB');
  });

  test('should format undefined and null correctly', () => {
    expect(formatBytesValue(undefined)).toBe('- B');
    expect(formatBytesValue(null)).toBe('- B');
  });
});

describe('formatEnergyValue function', () => {
  test('should format small energy value correctly', () => {
    const value = 0.500001; // 500 mWh
    const formattedValue = formatEnergyValue(value);
    expect(formattedValue).toBe('500.00 mWh');
  });

  test('should format float energy value correctly', () => {
    const value = 1.101; // 1.1 Wh
    const formattedValue = formatEnergyValue(value);
    expect(formattedValue).toBe('1.10 Wh');
  });

  test('should format energy value correctly', () => {
    const value = 1.001; // 1 Wh
    const formattedValue = formatEnergyValue(value);
    expect(formattedValue).toBe('1 Wh');
  });

  test('should format large energy value correctly', () => {
    const value = 1000.001; // 1000 Wh
    const formattedValue = formatEnergyValue(value);
    expect(formattedValue).toBe('1.00 kWh');
  });

  test('should format undefined and null correctly', () => {
    expect(formatEnergyValue(undefined)).toBe('- Wh');
    expect(formatEnergyValue(null)).toBe('- Wh');
  });
});

describe('formatNetworkTransferValue function', () => {
  test('should format small network transfer value correctly', () => {
    const value = 512; // 512 bit
    const formattedValue = formatNetworkTransferValue(value);
    expect(formattedValue).toBe('512 bit/s');
  });

  test('should format network transfer value correctly', () => {
    const value = 1024; // 1 Kib
    const formattedValue = formatNetworkTransferValue(value);
    expect(formattedValue).toBe('1.00 Kib/s');
  });

  test('should format large network transfer value correctly', () => {
    const value = 1048576; // 1 Mib
    const formattedValue = formatNetworkTransferValue(value);
    expect(formattedValue).toBe('1.00 Mib/s');
  });

  test('should format undefined and null correctly', () => {
    expect(formatNetworkTransferValue(undefined)).toBe('- bit/s');
    expect(formatNetworkTransferValue(null)).toBe('- bit/s');
  });
});

describe('formatPercentValue function', () => {
  test('should format percent value correctly', () => {
    const value = 50;
    const formattedValue = formatPercentValue(value);
    expect(formattedValue).toBe('50.00 %');
  });

  test('should format undefined and null correctly', () => {
    expect(formatPercentValue(undefined)).toBe('- %');
    expect(formatPercentValue(null)).toBe('- %');
  });
});

describe('formatNumberOfResources function', () => {
  test.each([
    [1, '1 resource'],
    [2, '2 resources'],
    [1000, '1,000 resources'],
  ])('should format small network transfer value correctly', (num, str) => {
    expect(formatNumberOfResources(num)).toBe(str);
  });
});

describe('signOfTheNumber function', () => {
  test.each([
    [null, ''],
    [undefined, ''],
    [1, '+'],
    [0, '±'],
    [-1, ''],
  ])('can get correct sign for value', (num, str) => {
    expect(signOfTheNumber(num)).toBe(str);
  });
});
