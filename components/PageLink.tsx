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

'use client';

import { ReactNode, useEffect, useState } from 'react';

import Link from 'next/link';

import { NodeParams } from '@luigi-project/client';
import { Anchor } from '@mantine/core';

/**
 * PageLink component for Props
 */
export type PageLinkProps = {
  children: string | ReactNode;
  title?: string;
  path?: string;
  query?: {
    [key: string]: string | string[];
  };
  color?: string;
  display?: 'block' | 'inline';
  h?: string;
};

/**
 * Page transition link component
 * @param props {@link Props}
 * @returns JSX.Element to display a page transition link
 */
export const PageLink = ({ children, title, path, query, color, display, h }: PageLinkProps) => {
  const [luigiClient, setLuigiClient] = useState<(typeof window)['LuigiClient'] | null>(null);

  /** FIXME Warning : React Hook useEffect has missing dependencies: 'luigiClient' and 'router.isReady'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps */
  useEffect(() => {
    const client = require('@luigi-project/client');
    client.addInitListener(() => {
      setLuigiClient(client);
    });
  }, []);

  if (!path) {
    return <>{children}</>;
  }

  return luigiClient ? (
    /** If LuigiCore exists, make it a Luigi link */
    <Anchor
      title={title}
      onClick={() => {
        const linkManager = luigiClient.linkManager();
        query && linkManager.withParams(query as NodeParams);
        linkManager.navigate(path);
      }}
      size='sm'
      c={color}
      display={display}
      h={h}
      /** Used to disable dragging in react-grid-layout used in the tiles of the dashboard */
    >
      {children}
    </Anchor>
  ) : (
    /**
     * If LuigiCore is not present, make it a normal link
     * However, you cannot jump to links between micro frontends
     */
    <Link
      href={{
        /** /xxx/xxx-resource-detail -> /resource-detail */
        pathname: `${path.substring(path.indexOf('-') + 1)}`,
        query: query,
      }}
      passHref
      legacyBehavior
    >
      <Anchor title={title} display={display} c={color} h={h}>
        {children}
      </Anchor>
    </Link>
  );
};
