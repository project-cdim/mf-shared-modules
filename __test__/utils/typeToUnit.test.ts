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

import { typeToUnit } from '@/shared-modules/utils/typeToUnit';

describe('typeToUnit', () => {
  test('should return the correct value when the type is memory', () => {
    expect(typeToUnit('memory', 3)).toBe('MiB');
    expect(typeToUnit('memory', 3 * 1024)).toBe('GiB');
  });
  test('should return the correct value when the type is storage', () => {
    expect(typeToUnit('storage', 3 * 1024 ** 2)).toBe('MiB');
    expect(typeToUnit('storage', 3 * 1024 ** 3)).toBe('GiB');
  });
  test('should return the correct value when the type is Core-related', () => {
    expect(typeToUnit('CPU', 1234)).toBe('cores');
    expect(typeToUnit('Accelerator', 5678)).toBe('cores');
    expect(typeToUnit('DSP', 1234)).toBe('cores');
    expect(typeToUnit('FPGA', 5678)).toBe('cores');
    expect(typeToUnit('GPU', 1234)).toBe('cores');
    expect(typeToUnit('UnknownProcessor', 5678)).toBe('cores');
  });
  test('should return the correct value when the type is other', () => {
    expect(typeToUnit('graphicController', 1234)).toBe('');
    expect(typeToUnit('networkInterface', 5678)).toBe('');
  });
});
