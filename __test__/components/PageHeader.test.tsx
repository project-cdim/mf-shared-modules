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

import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageHeader, PageLink, ReloadHeader } from '@/shared-modules/components';

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  ReloadHeader: jest.fn(),
  PageLink: jest.fn(),
}));

const props = {
  pageTitle: 'Page Title',
  items: [
    {
      title: 'Top Page',
      href: './',
    },
    {
      title: 'Second Page',
      href: './second/',
    },
  ],
  mutate: () => {
    console.log('mutate()');
  },
  loading: false,
};

describe('PageHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('That the header is displayed', () => {
    render(<PageHeader {...props} />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Page Title');
  });
  test('That breadcrumbs can be passed labels and link addresses', () => {
    render(<PageHeader {...props} />);

    (PageLink as unknown as jest.Mock).mock.calls.forEach((call, index) => {
      expect(call[0]).toHaveProperty('title', props.items[index].title);
      expect(call[0]).toHaveProperty('link', props.items[index].href);
    });
  });
  test('That the callback function mutate and loading is passed to ReloadHeader', () => {
    render(<PageHeader {...props} />);
    (ReloadHeader as unknown as jest.Mock).mock.calls.forEach((call) => {
      expect(call).toHaveProperty('mutate', props.mutate);
      expect(call).toHaveProperty('loading', props.loading);
    });
  });
  test('That the header is displayed without links', () => {
    const props2 = {
      ...props,
      items: [
        {
          title: 'Top Page',
        },
        {
          title: 'Second Page',
          href: './second/',
        },
      ],
    };
    render(<PageHeader {...props2} />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Page Title');
  });
});
