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
import { ExternalLink } from '@/shared-modules/components';

describe('ExternalLink Component', () => {
  test('Rendering correctly', () => {
    render(
      <ExternalLink url='https://www.sample.com/' title='Title Text'>
        LinkLabelText
      </ExternalLink>
    );
    const ExLnk = screen.getByRole('link');
    expect(ExLnk).toBeInTheDocument();
    expect(ExLnk).toHaveProperty('href', 'https://www.sample.com/');
    expect(ExLnk).toHaveProperty('title', 'Title Text [External Web Site]');
  });
});
