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

export function toDisplayLoader(element: unknown): jest.CustomMatcherResult {
  if (element instanceof HTMLElement) {
    const isLoader =
      element.querySelector('.mantine-Loader-root') ??
      element.querySelector('.mantine-LoadingOverlay-root') ??
      element.querySelector('.mantine-Button-loader');

    if (isLoader !== null) {
      return {
        pass: true,
        message: () => `expected ${element} not to display loader`,
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${element} to display loader`,
      };
    }
  }

  throw new TypeError(`expected ${element} to be an instance of HTMLElement`);
}

expect.extend({ toDisplayLoader });
