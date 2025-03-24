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

import { renderHook } from '@testing-library/react';
import useSWRImmutable from 'swr/immutable';

import { APIresources } from '@/shared-modules/types';
import { useResourceNumbers } from '@/shared-modules/utils/hooks';

jest.mock('swr/immutable');

describe('useResourceNumbers', () => {
  beforeEach(() => {
    (useSWRImmutable as unknown as jest.Mock).mockReset();
  });

  test('if fetched data and contains numbers info, return numbers', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: resData,
      error: null,
      isValidating: false,
    }));

    const {
      result: {
        current: {
          resourcesAll,
          resourcesOk,
          resourcesUnallocated,
          resourcesAllocated,
          resourcesCritical,
          resourcesWarning,
          resourcesDisabled,
          resourcesAvailable,
          resourcesUnavailable,
          resourcesError,
          resourcesValidating,
        },
      },
    } = renderHook(() => useResourceNumbers());

    expect(resourcesAll).toBe(5);
    expect(resourcesOk).toBe(2);
    expect(resourcesUnallocated).toBe(3);
    expect(resourcesAllocated).toBe(2);
    expect(resourcesCritical).toBe(1);
    expect(resourcesWarning).toBe(2);
    expect(resourcesDisabled).toBe(2);
    expect(resourcesAvailable).toBe(3);
    expect(resourcesUnavailable).toBe(2);
    expect(resourcesError).toBeNull();
    expect(resourcesValidating).toBe(false);
  });

  test('if fetched data but resources is empty array, return numbers zero', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: { count: 0, resources: [] },
      error: null,
      isValidating: false,
    }));
    const {
      result: {
        current: {
          resourcesAll,
          resourcesAllocated,
          resourcesCritical,
          resourcesWarning,
          resourcesError,
          resourcesValidating,
        },
      },
    } = renderHook(() => useResourceNumbers());

    expect(resourcesAll).toBe(0);
    expect(resourcesAllocated).toBe(0);
    expect(resourcesCritical).toBe(0);
    expect(resourcesWarning).toBe(0);
    expect(resourcesError).toBeNull();
    expect(resourcesValidating).toBe(false);
  });

  test('if fetched data but not contains any numbers info, return undefined', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: { resources: undefined },
      error: null,
      isValidating: false,
    }));
    const {
      result: {
        current: {
          resourcesAll,
          resourcesOk,
          resourcesUnallocated,
          resourcesAllocated,
          resourcesCritical,
          resourcesWarning,
          resourcesDisabled,
          resourcesAvailable,
          resourcesUnavailable,
          resourcesError,
          resourcesValidating,
        },
      },
    } = renderHook(() => useResourceNumbers());

    expect(resourcesAll).toBeUndefined();
    expect(resourcesOk).toBeUndefined();
    expect(resourcesUnallocated).toBeUndefined();
    expect(resourcesAllocated).toBeUndefined();
    expect(resourcesCritical).toBeUndefined();
    expect(resourcesWarning).toBeUndefined();
    expect(resourcesDisabled).toBeUndefined();
    expect(resourcesAvailable).toBeUndefined();
    expect(resourcesUnavailable).toBeUndefined();
    expect(resourcesError).toBeNull();
    expect(resourcesValidating).toBe(false);
  });

  test.each([
    ['error', false],
    [null, true],
  ])('if not fetched data, return only error and loading state', (error, isValidating) => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: error,
      isValidating: isValidating,
    }));
    const {
      result: {
        current: {
          resourcesAll,
          resourcesOk,
          resourcesUnallocated,
          resourcesAllocated,
          resourcesCritical,
          resourcesWarning,
          resourcesDisabled,
          resourcesAvailable,
          resourcesUnavailable,
          resourcesError,
          resourcesValidating,
        },
      },
    } = renderHook(() => useResourceNumbers());

    expect(resourcesAll).toBeUndefined();
    expect(resourcesOk).toBeUndefined();
    expect(resourcesUnallocated).toBeUndefined();
    expect(resourcesAllocated).toBeUndefined();
    expect(resourcesCritical).toBeUndefined();
    expect(resourcesWarning).toBeUndefined();
    expect(resourcesDisabled).toBeUndefined();
    expect(resourcesAvailable).toBeUndefined();
    expect(resourcesUnavailable).toBeUndefined();
    expect(resourcesError).toBe(error);
    expect(resourcesValidating).toBe(isValidating);
  });
});

const resData: APIresources = {
  count: 5,
  resources: [
    {
      annotation: {
        available: true,
      },
      device: {
        baseSpeedMHz: 4000,
        deviceID: 'res101',
        deviceSwitchInfo: 'CXL11',
        links: [
          {
            deviceID: 'res202',
            type: 'memory',
          },
        ],
        status: {
          health: 'Warning',
          state: 'Enabled',
        },
        type: 'CPU',
      },
      resourceGroupIDs: [],
      nodeIDs: [],
    },
    {
      annotation: {
        available: true,
      },
      device: {
        baseSpeedMHz: 4000,
        deviceID: 'res1019',
        deviceSwitchInfo: 'CXL11',
        links: [
          {
            deviceID: 'res202',
            type: 'memory',
          },
        ],
        status: {
          health: 'Warning',
          state: 'Enabled',
        },
        type: 'CPU',
      },
      resourceGroupIDs: [],
      nodeIDs: ['node0001'],
    },
    {
      annotation: {
        available: false,
      },
      device: {
        baseSpeedMHz: 4000,
        deviceID: 'res102',
        deviceSwitchInfo: 'CXL11',
        links: [
          {
            deviceID: 'res203',
            type: 'memory',
          },
          {
            deviceID: 'res302',
            type: 'storage',
          },
          {
            deviceID: 'res401',
            type: 'networkInterface',
          },
        ],
        status: {
          health: 'OK',
          state: 'Disabled',
        },
        type: 'CPU',
      },
      resourceGroupIDs: [],
      nodeIDs: [],
    },
    {
      annotation: {
        available: false,
      },
      device: {
        baseSpeedMHz: 4000,
        deviceID: 'res105',
        deviceSwitchInfo: 'CXL11',
        status: {
          health: 'Critical',
          state: 'Disabled',
        },
        type: 'CPU',
      },
      resourceGroupIDs: [],
      nodeIDs: [],
    },
    {
      annotation: {
        available: true,
      },
      device: {
        deviceID: 'res103',
        deviceSwitchInfo: 'CXL11',
        links: [],
        status: {
          health: 'OK',
          state: 'Enabled',
        },
        type: 'Accelerator',
      },
      resourceGroupIDs: [],
      nodeIDs: ['node001'],
    },
  ],
};
