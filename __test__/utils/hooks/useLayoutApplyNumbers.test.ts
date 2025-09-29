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

import { useLayoutApplyNumbers } from '@/shared-modules/utils/hooks';

import { APIApplyIDGetResponse, APIApplyResult, APILayoutApplyList } from '../../../types';

jest.mock('swr/immutable');

describe('useLayoutApplyNumbers', () => {
  beforeEach(() => {
    (useSWRImmutable as jest.Mock).mockReset();
  });

  test('if fetched data and contains numbers info, return numbers', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: dummyAPILayoutApplyList,
      error: null,
      isValidating: false,
    }));

    const {
      result: {
        current: { layoutApplyAll, layoutApplyFailed, layoutApplySuspended, layoutApplyError, layoutApplyValidating },
      },
    } = renderHook(() => useLayoutApplyNumbers());

    expect(layoutApplyAll).toBe(12);
    expect(layoutApplyFailed).toBe(1);
    expect(layoutApplySuspended).toBe(2);
    expect(layoutApplyError).toBeNull();
    expect(layoutApplyValidating).toBe(false);
  });
  test('if fetched data but applyResults is empty array, return numbers zero', () => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: { count: 0, applyResults: [] },
      error: null,
      isValidating: false,
    }));

    const {
      result: {
        current: { layoutApplyAll, layoutApplyFailed, layoutApplySuspended, layoutApplyError, layoutApplyValidating },
      },
    } = renderHook(() => useLayoutApplyNumbers());

    expect(layoutApplyAll).toBe(0);
    expect(layoutApplyFailed).toBe(0);
    expect(layoutApplySuspended).toBe(0);
    expect(layoutApplyError).toBeNull();
    expect(layoutApplyValidating).toBe(false);
  });

  test.each([
    ['error', false],
    [null, true],
  ])('if not fetched data, return only error and loading state', (error, isValidating) => {
    (useSWRImmutable as jest.Mock).mockImplementation(() => ({
      data: undefined,
      error: error,
      isValidating: isValidating,
    }));

    const {
      result: {
        current: { layoutApplyAll, layoutApplyFailed, layoutApplySuspended, layoutApplyError, layoutApplyValidating },
      },
    } = renderHook(() => useLayoutApplyNumbers());

    expect(layoutApplyAll).toBeUndefined();
    expect(layoutApplyFailed).toBeUndefined();
    expect(layoutApplySuspended).toBeUndefined();
    expect(layoutApplyError).toBe(error);
    expect(layoutApplyValidating).toBe(isValidating);
  });
});

const applyResults: APIApplyIDGetResponse[] = [
  {
    applyID: 'afoi8ds0-sfa1-rsky',
    status: 'IN_PROGRESS',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    startedAt: '2024/03/02 11:11:11',
  },
  {
    applyID: 'bfoi8ds0-sfa1-rskg',
    status: 'IN_PROGRESS',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    startedAt: '2024/03/02 18:31:14',
  },
  {
    applyID: 'bifo123s-sfja-213t',
    status: 'FAILED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    startedAt: '2024/03/03 12:03:01',
    endedAt: '2024/03/04 17:24:28',
  },
  {
    applyID: 'c131sijf-2122-dfa',
    status: 'COMPLETED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    startedAt: '2024/03/03 11:23:22',
    endedAt: '2024/03/23 13:24:28',
  },
  {
    applyID: 'diso123s-sfja-2131',
    status: 'CANCELING',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    startedAt: '2024/03/03 13:00:01',
  },
  {
    applyID: 'eif1123s-sfja-213a',
    status: 'CANCELED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    rollbackProcedures: [],
    startedAt: '2024/03/03 12:00:01',
    endedAt: '2024/03/23 21:24:28',
    canceledAt: '2024/03/23 21:24:28',
    executeRollback: true,
    rollbackStatus: 'COMPLETED',
  },
  {
    applyID: 'eif1123s-sfja-2132',
    status: 'CANCELED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    rollbackProcedures: [],
    startedAt: '2024/03/03 12:01:01',
    endedAt: '2024/03/23 21:24:28',
    canceledAt: '2024/03/23 21:24:28',
    executeRollback: true,
  },
  {
    applyID: 'eif1123s-sfja-2137',
    status: 'SUSPENDED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    rollbackProcedures: [],
    startedAt: '2024/03/03 12:02:01',
  },
  {
    applyID: '21fhf23s-sfja-2137',
    status: 'SUSPENDED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    rollbackProcedures: [],
    startedAt: '2024/03/03 13:02:01',
  },
  {
    applyID: 'afoi8ds0-sfa1-stl3',
    status: 'CANCELED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    rollbackProcedures: [],
    startedAt: '2024/03/02 22:11:11',
    endedAt: undefined,
    executeRollback: true,
    rollbackStatus: 'IN_PROGRESS',
  },
  {
    applyID: 'bfoi8ds0-sfa1-stl6',
    status: 'CANCELED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    rollbackProcedures: [],
    startedAt: '2024/03/02 19:32:15',
    endedAt: undefined,
    executeRollback: true,
    rollbackStatus: 'SUSPENDED',
  },
  {
    applyID: 'cfoi8ds0-sfa1-stl8',
    status: 'CANCELED',
    procedures: [],
    applyResult: [] as APIApplyResult[],
    rollbackProcedures: [],
    startedAt: '2024/03/02 19:32:15',
    endedAt: undefined,
    executeRollback: true,
    rollbackStatus: 'FAILED',
  },
];

const dummyAPILayoutApplyList: APILayoutApplyList = {
  count: 12,
  totalCount: 20,
  applyResults: applyResults,
};
