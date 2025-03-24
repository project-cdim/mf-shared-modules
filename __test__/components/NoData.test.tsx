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

import React from 'react';

import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { NoData } from '@/shared-modules/components/NoData';

describe('NoData component', () => {
  test('renders "No data" message when isNoData is true', () => {
    render(
      <NoData isNoData={true}>
        <div>Data content</div>
      </NoData>
    );
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  test('renders children when isNoData is false', () => {
    render(
      <NoData isNoData={false}>
        <div>Data content</div>
      </NoData>
    );
    expect(screen.getByText('Data content')).toBeInTheDocument();
  });
});
