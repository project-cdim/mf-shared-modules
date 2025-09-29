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

import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelectForTableFilter } from '@/shared-modules/components/TableFilters';

type StoryMultiSelect = StoryObj<typeof MultiSelectForTableFilter>;

const metaMultiSelect: Meta<typeof MultiSelectForTableFilter> = {
  title: 'shared-modules/components/MultiSelectForTableFilter',
  component: MultiSelectForTableFilter,
};
export default metaMultiSelect;

export const DemoMultiSelect: StoryMultiSelect = {
  args: {
    label: 'Label',
    options: [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
      { value: '3', label: 'Three' },
    ],
    // value: ['1'],
    setValue(p) {
      console.log(p);
    },
  },
};
