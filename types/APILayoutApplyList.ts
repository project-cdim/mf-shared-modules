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

import { ApplyStatuses, RollbackStatuses } from '@/shared-modules/constant';

/** Apply status */
export type ApplyStatus = (typeof ApplyStatuses)[number];
export type ApplyStatusLabelJa = '進行中' | '失敗' | '完了' | 'キャンセル中' | 'キャンセル完了' | '中断';
export type ApplyStatusLabelKey =
  | 'In Progress'
  | 'Failed'
  | 'Completed'
  | 'Canceling'
  | 'Canceled.completed'
  | 'Suspended.status';

/** Rollback status */

export type RollbackStatus = (typeof RollbackStatuses)[number];
export type RollbackStatusLabelJa = '進行中' | '失敗' | '完了' | '中断';
export type RollbackStatusLabelKey = 'In Progress' | 'Failed' | 'Completed' | 'Suspended.status';

/** Type definition for the response of GET /layout-apply to retrieve the layout apply result list */
export type APILayoutApplyList = {
  count: number;
  totalCount: number;
  applyResults: APIApplyIDGetResponse[];
};

/** Response body for retrieving the layout apply status by ID */
export type APIApplyIDGetResponse = {
  applyID: string;
  status: ApplyStatus;
  procedures?: APIProcedure[];
  applyResult?: APIApplyResult[];
  startedAt: string;
  suspendedAt?: string;
  resumedAt?: string;
  canceledAt?: string;
  endedAt?: string;
  executeRollback?: boolean; // or string
  rollbackStatus?: RollbackStatus;
  rollbackProcedures?: APIProcedure[];
  rollbackResult?: APIApplyResult[];
  rollbackStartedAt?: string;
  rollbackEndedAt?: string;
  resumeProcedures?: APIProcedure[];
  resumeResult?: APIApplyResult[];
};

/** Detailed list of migration procedure execution results */
export type APIApplyResult = {
  operationID: number;
  status: ApplyProcedureStatus;
  uri?: string;
  method?: string;
  endedAt?: string;
  startedAt?: string;
  queryParameter?: string;
  requestBody?: {
    action?: string;
    deviceID?: string;
  };
  statusCode?: number;
  responseBody?:
    | {
        code: string | number;
        message: string;
      }
    | object;
  isOSBoot?: {
    uri: string;
    queryParameter?: object;
    method: string;
    statusCode: number;
    responseBody:
      | {
          code: string | number;
          message: string;
        }
      | object;
  };
  getInformation?: {
    responseBody: { powerState?: string; code?: string | number; message?: string } | object;
  };
};

/** Migration procedure */
export type ApplyProcedureStatusLabelJa = '失敗' | '完了' | 'キャンセル' | 'スキップ';
export type ApplyProcedureStatusLabelKey = 'Failed' | 'Completed' | 'Canceled.normal' | 'Skipped';

type APIProcedure = {
  operationID: number;
  operation: ProcedureOperation;
  targetCPUID?: string;
  targetDeviceID: string;
  dependencies: number[];
};

export const APPLY_PROCEDURE_STATUS = ['COMPLETED', 'FAILED', 'SKIPPED', 'CANCELED'] as const;
export type ApplyProcedureStatus = (typeof APPLY_PROCEDURE_STATUS)[number];

export type ApplyProcedureOperationLabelJa = '接続' | '切断' | '起動' | '停止';
export type ApplyProcedureOperationLabelKey = 'Connect' | 'Disconnect' | 'Boot' | 'Shutdown';

export const PROCEDURE_OPERATION = ['connect', 'disconnect', 'boot', 'shutdown'] as const;
export type ProcedureOperation = (typeof PROCEDURE_OPERATION)[number];
