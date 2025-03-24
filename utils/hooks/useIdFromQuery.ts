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

import { useQuery } from './useQuery';

/**
 * Custom hook to extract the `id` parameter from the query string.
 *
 * @returns The `id` parameter from the query string. If the `id` is not present or is not a string, returns an empty string.
 */
export const useIdFromQuery = (): string => {
  const id = useQuery()?.id;
  if (typeof id === 'string') return id;
  if (Array.isArray(id) && typeof id[0] === 'string') return id[0];
  return '';
};
