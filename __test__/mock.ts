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

export {};

jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useTranslations: jest.fn(() => {
    return (str: string) => str;
  }),
  useLocale: jest.fn().mockReturnValue('en'),
}));

jest.mock('@luigi-project/client', () => ({
  linkManager: jest.fn(() => ({
    withParams: jest.fn(),
    navigate: jest.fn(),
  })),
  getToken: jest.fn().mockReturnValue('testTokenString'),
  addInitListener: jest.fn().mockImplementation((callback) => {
    callback();
  }),
  getNodeParams: jest.fn(),
}));
