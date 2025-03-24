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

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { Button, Group, Text } from '@mantine/core';
import { IconReload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { SWRConfig } from 'swr';
import type { Middleware } from 'swr';

import { useLocaleDateString } from '../utils/hooks';

// istanbul ignore next
const FetchedContext = createContext<
  [Date | undefined, Dispatch<SetStateAction<Date | undefined>>]
>([undefined, () => void {}]);

/**
 * A wrapper component for ReloadHeader that provides ContextProvider of last fetched datetime and {@link SWRConfigForReloadButton}.
 * @param children - Child components
 * @returns JSX.Element to A wrapper component for ReloadHeader component.
 */
export const ReloadHeaderProviderAndConfig = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [lastFetched, setLastFetched] = useState<Date | undefined>(undefined);

  return (
    <FetchedContext.Provider value={[lastFetched, setLastFetched]}>
      <SWRConfigForReloadButton>{children}</SWRConfigForReloadButton>
    </FetchedContext.Provider>
  );
};

/**
 * A wrapper component that provides SWR configuration for following features.
 * - Update a last fetched datetime of ReloadHeader component after each request
 * - Clear a data when an error occurs
 * @param children - The child components to render.
 * @returns The JSX element that provides SWR configuration.
 */
const SWRConfigForReloadButton = ({ children }: { children: ReactNode }) => {
  const [, setLastFetched] = useContext(FetchedContext);
  const updateLastFetched = () => {
    setLastFetched(new Date());
  };

  return (
    <SWRConfig
      value={{
        use: [onErrorClear],
        // Technically, it is possible to move following update functions into middleware,
        // but it is not recommended because it is difficult to understand the code.
        // i.e. Calling `setLastFetched` without condition in middleware result in infinite loop.
        // Note that an update of swr.data can not be used as a condition because of a SWR cache.
        onSuccess: updateLastFetched,
        onError: updateLastFetched,
      }}
    >
      {children}
    </SWRConfig>
  );
};

const onErrorClear: Middleware = (useSWRFunc) => {
  return (...args) => {
    const swr = useSWRFunc(...args);

    return { ...swr, data: swr.error ? undefined : swr.data };
  };
};

/**
 * Props for the ReloadHeader component
 */
export type ReloadHeaderProps = {
  // SWR's mutate
  mutate: CallableFunction;
  // Loading flag
  loading: boolean;
};

/**
 * Component to display the reload button and fetched datetime text.
 * This component needs to be child-component of {@link ReloadHeaderProviderAndConfig} to get and update the fetched datetime.
 * @param props {@link ReloadHeaderProps}
 * @returns JSX.Element to display the reload button and fetched datetime text
 */
export const ReloadHeader = ({ mutate, loading }: ReloadHeaderProps) => {
  const t = useTranslations();

  const [lastFetched] = useContext(FetchedContext);
  // Displayed in the American datetime format if en locale.
  const dateString = useLocaleDateString(lastFetched);

  return (
    <>
      <Button
        radius='xl'
        variant='light'
        onClick={() => mutate()}
        leftSection={<IconReload />}
        loading={loading || !lastFetched}
        loaderProps={{ type: 'dots' }}
      >
        {t('Reload')}
      </Button>
      <Group gap={10}>
        <Text fz='sm' c='dimmed'>
          {t('Last fetched')}
        </Text>
        {lastFetched && (
          <Text fz='md'>
            <time dateTime={dateString} suppressHydrationWarning>
              {dateString}
            </time>
          </Text>
        )}
      </Group>
    </>
  );
};
