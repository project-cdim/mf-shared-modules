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

export let multiChartData: GraphViewData = [
  {
    date: '3/1',
    Accelerator: 55,
    CPU: 10,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/3',
    Accelerator: 60,
    CPU: 20,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/6',
    Accelerator: 75,
    CPU: 30,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/9',
    Accelerator: 80,
    CPU: 10,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/12',
    Accelerator: 83,
    CPU: 20,
    GPU: 10,
    DSP: 50,
  },
  {
    date: '3/15',
    Accelerator: 85,
    CPU: 60,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/18',
    Accelerator: 88,
    CPU: 90,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/21',
    Accelerator: 92,
    CPU: 10,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/24',
    Accelerator: 95,
    CPU: 10,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/27',
    Accelerator: 96,
    CPU: 60,
    GPU: 30,
    DSP: 20,
  },
  {
    date: '3/28',
    Accelerator: 0,
    CPU: 50,
    GPU: 40,
    DSP: 32,
  },
];

export let multiChartDataLastZero: GraphViewData = _.cloneDeep(multiChartData).map((data, index) => {
  if (index === multiChartData.length - 1) {
    data.Accelerator = 0;
    data.CPU = 0;
    data.GPU = 0;
    data.DSP = 0;
  }
  return data;
});

export let multiChartDataMissing: GraphViewData = _.cloneDeep(multiChartData).map((data, index) => {
  if (data.date in ['3/18'] || index === multiChartData.length - 1) {
    data.Accelerator = null;
    data.CPU = null;
    data.GPU = null;
    data.DSP = null;
  } else if (data.date in ['3/6']) {
    data.Accelerator = null;
  } else if (data.date in ['3/9']) {
    data.CPU = null;
    data.DSP = null;
  }
  return data;
});
