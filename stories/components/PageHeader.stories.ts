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

import { PageHeader } from '@/shared-modules/components';

const meta = {
  title: 'Shared-Modules/components/PageHeader',
  component: PageHeader,
  argTypes: {},
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    pageTitle: 'Title',
    mutate: () => {
      alert('mutate()');
    },
    loading: false,
    items: [
      {
        title: 'Link 1',
        href: 'URL1',
      },
      {
        title: 'Link 2',
        href: 'URL2',
      },
    ],
  },
};

export const EmptyTitle: Story = {
  args: {
    pageTitle: '',
    mutate: () => {
      alert('mutate()');
    },
    loading: false,
    items: [
      {
        title: 'Link 1',
        href: 'URL1',
      },
      {
        title: 'Link 2',
        href: 'URL2',
      },
    ],
  },
};

export const EmptyLinks: Story = {
  args: {
    pageTitle: 'Title',
    mutate: () => {
      alert('mutate()');
    },
    loading: false,
    items: [],
  },
};

export const EmptyLinkTitle: Story = {
  args: {
    pageTitle: 'Title',
    mutate: () => {
      alert('mutate()');
    },
    loading: false,
    items: [
      {
        title: '',
        href: 'URL1',
      },
      {
        title: 'Link 2',
        href: 'URL2',
      },
    ],
  },
};

export const EmptyLinkHref: Story = {
  args: {
    pageTitle: 'Title',
    mutate: () => {
      alert('mutate()');
    },
    loading: false,
    items: [
      {
        title: 'Link 1',
        href: '',
      },
      {
        title: 'Link 2',
        href: 'URL2',
      },
    ],
  },
};
