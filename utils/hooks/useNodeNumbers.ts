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

import { APInode, APInodes } from '@/shared-modules/types';

/**
 * Custom hook to fetch and calculate node numbers.
 * @returns An object containing the node numbers and related information.
 */
export const useNodeNumbers = () => {
  const { data, error, isValidating } = useSWRImmutable<APInodes>(
    `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/nodes`
  );
  if (!data) return { nodesError: error, nodesValidating: isValidating };

  const nodesAll = Number.isInteger(data.count) ? data.count : undefined;
  const nodesOk = getNumber(data, (n: APInode) => isOkResource(n));
  const nodesCritical = getNumber(data, (n: APInode) => isCriticalResource(n));
  const nodesWarning = getNumber(data, (n: APInode) => isWarningResource(n));
  const nodesDisabled = getNumber(data, (n: APInode) => isDisabledResource(n));

  return {
    nodesAll,
    nodesOk,
    nodesCritical,
    nodesWarning,
    nodesDisabled,
    nodesError: error,
    nodesValidating: isValidating,
  };
};

const getNumber = (
  data: APInodes,
  isTarget: CallableFunction
): number | undefined => {
  if (!Array.isArray(data.nodes)) return undefined;
  return data.nodes.filter((n) => isTarget(n)).length;
};

const isCriticalResource = (node: APInode): boolean => {
  return node.resources.some((r) => r.device.status.health === 'Critical');
};

const isWarningResource = (node: APInode): boolean => {
  return node.resources.some((r) => r.device.status.health === 'Warning');
};

const isOkResource = (node: APInode): boolean => {
  return node.resources.every((r) => r.device.status.health === 'OK');
};

const isDisabledResource = (node: APInode): boolean => {
  return node.resources.some((r) => r.device.status.state === 'Disabled');
};
