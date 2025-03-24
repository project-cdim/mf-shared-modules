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

import { GraphViewData } from '@/shared-modules/components';

export let chartData: GraphViewData = [
  {
    date: '3/1',
    CPU: 55,
  },
  {
    date: '3/3',
    CPU: 60,
  },
  {
    date: '3/6',
    CPU: 75,
  },
  {
    date: '3/9',
    CPU: 80,
  },
  {
    date: '3/12',
    CPU: 83,
  },
  {
    date: '3/15',
    CPU: 85,
  },
  {
    date: '3/18',
    CPU: 88,
  },
  {
    date: '3/21',
    CPU: 92,
  },
  {
    date: '3/24',
    CPU: 95,
  },
  {
    date: '3/27',
    CPU: 96,
  },
  {
    date: '3/28',
    CPU: 87,
  },
];

export let chartDataLastZero: GraphViewData = _.cloneDeep(chartData).map((data, index) => {
  if (index === chartData.length - 1) {
    data.CPU = 0;
  }
  return data;
});

export let chartDataMissing: GraphViewData = _.cloneDeep(chartData).map((data, index) => {
  if (data.date in ['3/18'] || index === chartData.length - 1) {
    data.CPU = null;
  }
  return data;
});
