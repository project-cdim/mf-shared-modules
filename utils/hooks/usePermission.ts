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

import jwt from 'jsonwebtoken';

import { useLuigiClient } from '@/shared-modules/utils/hooks';

/**
 * Custom hook to check if a user has a specific role.
 * @param roleName - The name of the role to check.
 * @returns A boolean indicating whether the user has the specified role.
 */
export const usePermission = (roleName: string): boolean => {
  const token = useLuigiClient()?.getToken();
  const decodedToken = jwt.decode(token || '');
  const roles: string[] =
    (typeof decodedToken !== 'string' && decodedToken?.realm_access?.roles) ||
    [];

  return roles.some((role: string) => role === roleName);
};
