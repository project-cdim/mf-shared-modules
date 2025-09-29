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

import { useEffect, useState, useMemo } from 'react';

import { useRouter } from 'next/navigation';

/**
 * Custom hook that returns the query parameters from the current URL.
 * If Luigi client is available, it uses the query parameters from Luigi.
 * Otherwise, it uses the query parameters from the router.
 * luigi query is returned asynchronously.
 * @returns {NodeJS.Dict<string | string[]>} The query parameters as a dictionary.
 */
export const useQuery = (): NodeJS.Dict<string | string[]> => {
  const router: any = useRouter();
  const [query, setQuery] = useState({});
  const [luigiClient, setLuigiClient] = useState<(typeof window)['LuigiClient'] | null>(null);
  useEffect(() => {
    const client = require('@luigi-project/client');
    client.addInitListener(() => {
      /** Use the query of luigiClient */
      setLuigiClient(client);
      setQuery(client.getNodeParams());
    });
  }, []);
  useEffect(() => {
    if (!luigiClient && router.isReady) {
      /** If there is no luigiClient, use the router query */
      setQuery(router.query);
    }
  }, [luigiClient, router.isReady, router.query]);
  return query;
};

type QueryObjectType = { [key: string]: string[] };

/**
 * Custom React hook that returns the current query parameters as an object,
 * where each key maps to an array of string values.
 *
 * This hook uses `useQuery` to access the current query parameters and
 * transforms them into a `QueryObjectType` using `queryToArrayObject`.
 * The result is memoized and will only update when the query changes.
 *
 * @returns {QueryObjectType} An object representing the query parameters,
 *          with each key associated with an array of string values.
 */
export const useQueryArrayObject = (): QueryObjectType => {
  const query = useQuery();

  return useMemo(
    () =>
      new Proxy({} as QueryObjectType, {
        get: (_, prop) => {
          if (prop in query) {
            return splitAndFlatQueryString(query[prop as keyof QueryObjectType]);
          }
          return [];
        },
      }),
    [query]
  );
};

/**
 * Splits a string or an array of strings with ',', filters empty string and flattens the result.
 *
 * @param q - The string or array of strings to split and flatten.
 * @returns An array of strings after splitting and flattening the input.
 */
const splitAndFlatQueryString = (q: string | string[] | undefined): string[] => {
  if (q === undefined) return [];
  if (Array.isArray(q)) return q.map(splitString).flat(2);

  return splitString(q);
};

/**
 * Splits a string into an array of substrings using commas as separators,
 * optionally followed by whitespace. Empty strings are removed from the result.
 *
 * @param s - The input string to split.
 * @returns An array of non-empty substrings.
 */
const splitString = (s: string): string[] => {
  // regex to split by comma and remove empty strings in longest match
  const separator = /,\s*/;
  return s.split(separator).filter((item) => item !== '');
};
