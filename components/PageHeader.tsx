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

import { Breadcrumbs, Group, Title } from '@mantine/core';

import { PageLink, ReloadHeader } from '@/shared-modules/components';

/**
 * PageHeader component for Props
 */
export type PageHeaderProps = {
  /** Page title */
  pageTitle: string;
  /** SWR's mutate */
  mutate: CallableFunction;
  // Loading flag
  loading: boolean;
  /** Breadcrumbs */
  items: {
    /** Display string for link */
    title: string;
    /** Link URL */
    href?: string;
  }[];
};

/**
 * Component to display the header
 * @param props {@link PageHeaderProps}
 * @returns Header JSX.Element
 */
export const PageHeader = ({ pageTitle, mutate, loading, items }: PageHeaderProps) => {
  const pageLinks = items.map((item, index) => {
    const { title, href: path } = item;
    if (path) {
      return (
        <PageLink {...{ path }} key={index}>
          {title}
        </PageLink>
      );
    } else {
      return <span key={index}>{title}</span>;
    }
  });

  return (
    <div>
      <Breadcrumbs fz='sm'>{pageLinks}</Breadcrumbs>
      <Group align='center' style={{ paddingTop: '0.5rem' }}>
        <Title size='1.5rem'>{pageTitle}</Title>
        <ReloadHeader {...{ mutate, loading }} />
      </Group>
    </div>
  );
};
