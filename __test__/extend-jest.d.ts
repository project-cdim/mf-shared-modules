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

export interface CustomMatchers<R = unknown> {
  /**
   * This allow you to check if an element has any visible loader of Mantine.
   *
   * An element has a visible loader if any of the following conditions are met:
   *
   * - The element has a child with the class `mantine-Loader-root`
   * - The element has a child with the class `mantine-LoadingOverlay-root`
   * - The element has a child with the class `mantine-Button-loader`
   *
   * @throws {TypeError} If the `element` parameter is not an instance of `HTMLElement`.
   */
  toDisplayLoader(): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

export {};
