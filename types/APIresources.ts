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

import {
  APIDeviceHealth,
  APIDeviceState,
  APIDeviceType,
} from '@/shared-modules/types';

/** Type definition for the response of GET /resource */
export type APIresourceSummary = {
  device: {
    deviceID: string;
    type: APIDeviceType;
    status: {
      state: APIDeviceState;
      health: APIDeviceHealth;
    };
  };
};

export type APIresource = APIresourceSummary & {
  device: APIresourceSummary['device'] & {
    attribute?: {
      [index: string]: string;
    };
    deviceSwitchInfo?: string;
    links?: {
      type: APIDeviceType;
      deviceID: string;
    }[];
    totalCores?: number;
    capacityMiB?: number;
    driveCapacityBytes?: number;
    [index: string]: string | Record<never, never> | undefined;
  };
  resourceGroupIDs: string[];
  annotation: {
    available: boolean;
  };
  nodeIDs: string[];
};

/**
 * Checks if the provided argument is an APIresource.
 * @param arg - The argument to be checked.
 * @returns A boolean indicating whether the argument is an APIresource.
 */
export const isAPIresource = (arg: unknown): arg is APIresource => {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    'device' in arg &&
    typeof arg.device === 'object' &&
    arg.device !== null &&
    'nodeIDs' in arg &&
    _.isArray(arg.nodeIDs)
  );
};
/** Type definition for the response of GET /resources?detail=true */
export type APIresources = {
  count: number;
  resources: APIresource[];
};

/** Type definition for the response of GET /resources?detail=false */
export type APIresourcesSummary = {
  count: number;
  resources: APIresourceSummary[];
};

/** Type definition of the response of GET /nodes/{id}
 * Node : {
 *  id: string;
 *  resources: ResourceForNodeList; ← Define this as the type APIresourceForNodeDetail
 * }
 */
export type APIresourceForNodeDetail = Omit<APIresource, 'nodeIDs'>;
