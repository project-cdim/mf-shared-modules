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

import useSWRImmutable from 'swr/immutable';

import { fetcher } from '..';
import { APIApplyIDGetResponse, APILayoutApplyList } from '../../types';

export function useLayoutApplyNumbers() {
  const { data, error, isValidating } = useSWRImmutable<APILayoutApplyList>(
    `${process.env.NEXT_PUBLIC_URL_BE_LAYOUT_APPLY}/layout-apply?limit=1000`,
    fetcher
  );

  if (!data) return { layoutApplyError: error, layoutApplyValidating: isValidating };

  const layoutApplyAll = data.count;
  const layoutApplyFailed = getNumber(data, (n: APIApplyIDGetResponse) => isApplyFailed(n));
  const layoutApplySuspended = getNumber(data, (n: APIApplyIDGetResponse) => isApplySuspended(n));

  return {
    layoutApplyAll,
    layoutApplyFailed,
    layoutApplySuspended,
    layoutApplyError: error,
    layoutApplyValidating: isValidating,
  };
}

const getNumber = (data: APILayoutApplyList, isTarget: CallableFunction): number | undefined => {
  return data.applyResults.filter((n) => isTarget(n)).length;
};

const isApplyFailed = (apply: APIApplyIDGetResponse): boolean => {
  return apply.status === 'FAILED';
};

const isApplySuspended = (apply: APIApplyIDGetResponse): boolean => {
  return apply.status === 'SUSPENDED';
};
