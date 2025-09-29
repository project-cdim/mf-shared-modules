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

import { APInodes } from '@/shared-modules/types';
import { useNodeNumbers } from '@/shared-modules/utils/hooks';

jest.mock('swr/immutable');

describe('useNodeNumbers', () => {
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
        current: { nodesAll, nodesOk, nodesCritical, nodesWarning, nodesDisabled, nodesError, nodesValidating },
      },
    } = renderHook(() => useNodeNumbers());

    expect(nodesAll).toBe(3);
    expect(nodesOk).toBe(1);
    expect(nodesCritical).toBe(1);
    expect(nodesWarning).toBe(1);
    expect(nodesDisabled).toBe(2);
    expect(nodesError).toBeNull();
    expect(nodesValidating).toBe(false);
  });

  test('if fetched data but nodes is empty array, return numbers zero', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: { count: 0, nodes: [] },
      error: null,
      isValidating: false,
    }));
    const {
      result: {
        current: { nodesAll, nodesOk, nodesCritical, nodesWarning, nodesDisabled, nodesError, nodesValidating },
      },
    } = renderHook(() => useNodeNumbers());

    expect(nodesAll).toBe(0);
    expect(nodesOk).toBe(0);
    expect(nodesCritical).toBe(0);
    expect(nodesWarning).toBe(0);
    expect(nodesDisabled).toBe(0);
    expect(nodesError).toBeNull();
    expect(nodesValidating).toBe(false);
  });

  test('if fetched data but not contains any numbers info, return undefined', () => {
    (useSWRImmutable as unknown as jest.Mock).mockImplementation(() => ({
      data: { nodes: undefined },
      error: null,
      isValidating: false,
    }));
    const {
      result: {
        current: { nodesAll, nodesOk, nodesCritical, nodesWarning, nodesDisabled, nodesError, nodesValidating },
      },
    } = renderHook(() => useNodeNumbers());

    expect(nodesAll).toBeUndefined();
    expect(nodesOk).toBeUndefined();
    expect(nodesCritical).toBeUndefined();
    expect(nodesWarning).toBeUndefined();
    expect(nodesDisabled).toBeUndefined();
    expect(nodesError).toBeNull();
    expect(nodesValidating).toBe(false);
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
        current: { nodesAll, nodesOk, nodesCritical, nodesWarning, nodesDisabled, nodesError, nodesValidating },
      },
    } = renderHook(() => useNodeNumbers());

    expect(nodesAll).toBeUndefined();
    expect(nodesOk).toBeUndefined();
    expect(nodesCritical).toBeUndefined();
    expect(nodesWarning).toBeUndefined();
    expect(nodesDisabled).toBeUndefined();
    expect(nodesError).toBe(error);
    expect(nodesValidating).toBe(isValidating);
  });
});

const resData: APInodes = {
  count: 3,
  nodes: [
    {
      // exampleNode1: 'node10101',
      id: 'res10101',
      resources: [
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10101',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'CPU',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10202',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'memory',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10603',
            status: {
              health: 'Warning',
              state: 'Disabled',
            },
            type: 'virtualMedia',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
      ],
    },
    {
      // exampleNode1: 'node10102',
      id: 'res10102',
      resources: [
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10102',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'CPU',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
        {
          annotation: {
            available: false,
          },
          device: {
            deviceID: 'res10203',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'memory',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10302',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'storage',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
        {
          annotation: {
            available: false,
          },
          device: {
            deviceID: 'res10401',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'networkInterface',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res10604',
            status: {
              health: 'Critical',
              state: 'Disabled',
            },
            type: 'virtualMedia',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
      ],
    },
    {
      // exampleNode1: 'node10103',
      id: 'res10103',
      resources: [
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res30103',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'CPU',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
        {
          annotation: {
            available: false,
          },
          device: {
            deviceID: 'res30203',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'memory',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
        {
          annotation: {
            available: true,
          },
          device: {
            deviceID: 'res30302',
            status: {
              health: 'OK',
              state: 'Enabled',
            },
            type: 'storage',
            deviceSwitchInfo: 'CXL001',
          },
          detected: true,
          resourceGroupIDs: [],
        },
      ],
    },
  ],
};
