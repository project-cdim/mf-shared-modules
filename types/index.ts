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

export * from './APIDeviceAvailable';
export * from './APIDeviceDetection';
export * from './APIDeviceHealth';
export * from './APIDeviceState';
export * from './APIDeviceType';
export * from './APILayoutApplyList';
export * from './APInodes';
export * from './APIPromQL';
export * from './APIresources';
export * from './APPLayoutApplyList';
export * from './APPStatus';
export * from './LayoutApplyListQuery';
export * from './ResourceListQuery';

/** The DatePicker of mantine sets null when cleared */
export type DateRange = [Date | undefined | null, Date | undefined | null];
