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

import { APIresource, APIresources } from '@/shared-modules/types';

/**
 * Custom hook that retrieves resource numbers from the backend API.
 * @returns An object containing resource numbers and related information.
 */
export const useResourceNumbers = () => {
  const { data, error, isValidating } = useSWRImmutable<APIresources>(
    `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`
  );
  if (!data)
    return { resourcesError: error, resourcesValidating: isValidating };

  const resourcesAll = Number.isInteger(data.count) ? data.count : undefined;
  const resourcesOk = getNumber(data, isOk);
  const resourcesAllocated = getNumber(data, isAllocated);
  const resourcesUnallocated = getNumber(data, isUnallocated);
  const resourcesCritical = getNumber(data, isCritical);
  const resourcesWarning = getNumber(data, isWarning);
  const resourcesDisabled = getNumber(data, isDisabled);
  const resourcesAvailable = getNumber(data, isAvailable);
  const resourcesUnavailable = getNumber(data, isUnavailable);

  return {
    resourcesAll,
    resourcesOk,
    resourcesUnallocated,
    resourcesAllocated,
    resourcesCritical,
    resourcesWarning,
    resourcesDisabled,
    resourcesAvailable,
    resourcesUnavailable,
    resourcesError: error,
    resourcesValidating: isValidating,
  };
};

const getNumber = (
  data: APIresources,
  isTarget: CallableFunction
): number | undefined => {
  if (!Array.isArray(data.resources)) return undefined;
  return data.resources.filter((r) => isTarget(r)).length;
};

const isCritical = (resource: APIresource): boolean => {
  return resource.device.status.health === 'Critical';
};
const isWarning = (resource: APIresource): boolean => {
  return resource.device.status.health === 'Warning';
};
const isOk = (resource: APIresource): boolean => {
  return resource.device.status.health === 'OK';
};
const isDisabled = (resource: APIresource): boolean => {
  return resource.device.status.state === 'Disabled';
};
const isAllocated = (resource: APIresource): boolean => {
  return resource.nodeIDs.length > 0;
};
const isUnallocated = (resource: APIresource): boolean => {
  return resource.nodeIDs.length === 0;
};
const isAvailable = (resource: APIresource): boolean => {
  return resource.annotation.available;
};
const isUnavailable = (resource: APIresource): boolean => {
  return !resource.annotation.available;
};
