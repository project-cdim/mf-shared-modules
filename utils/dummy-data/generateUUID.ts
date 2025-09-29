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

/**
 * Generates a UUID (Universally Unique Identifier) in the format of
 * `xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx`.
 *
 * The UUID is generated using random numbers and follows the version 4 UUID
 * specification, where the 13th character is always "4" and the 17th character
 * is one of "8", "9", "A", or "B".
 *
 * Note: This implementation uses `Math.random()` for randomness, which is not
 * cryptographically secure. For secure UUID generation, consider using a library
 * like `crypto` or `uuid`.
 *
 * @returns {string} A randomly generated UUID string.
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
