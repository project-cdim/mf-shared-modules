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

import React from 'react';

import { Tooltip } from '@mantine/core';
import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
  IconBan,
  IconCheck,
  IconInfoCircle,
  IconPlayerPause,
  IconProgressCheck,
  IconProgressX,
  IconX,
} from '@tabler/icons-react';
import '@testing-library/jest-dom';

import { render } from '@/shared-modules/__test__/test-utils';
import { IconWithInfo } from '@/shared-modules/components';

// Create a mock of Tooltip
jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  Tooltip: jest.fn(),
}));
const mockTooltip = jest.fn().mockReturnValue(null);

describe('IconWithInfo', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
    (Tooltip as unknown as jest.Mock).mockImplementation(mockTooltip);
  });

  test('should have correct props for Tooltip', () => {
    render(<IconWithInfo label='test' type='check' />);
    expect(mockTooltip.mock.lastCall[0].label).toBe('test');
    expect(mockTooltip.mock.lastCall[0].color).toBe('#40c057');
    /** FIXME Error: Avoid direct Node access. Prefer using the methods from Testing Library.  testing-library/no-node-access */
    expect(mockTooltip.mock.lastCall[0].children.type).toBe(IconCheck);
    /** FIXME Error: Avoid direct Node access. Prefer using the methods from Testing Library.  testing-library/no-node-access */
    expect(mockTooltip.mock.lastCall[0].children.props.color).toBe('#40c057');
  });

  test.each([
    ['check', IconCheck, '#40c057'],
    ['info', IconInfoCircle, '#868e96'],
    ['disabled', IconBan, '#868e96'],
    ['in_progress', IconProgressCheck, '#40c057'],
    ['canceling', IconProgressX, '#868e96'],
    ['canceled', IconX, '#868e96'],
    ['suspended', IconPlayerPause, '#f59f00'],
  ] as const)('color and icon are changed depends on type: %s', (type, icon, color) => {
    render(<IconWithInfo label='test' type={type} />);
    expect(mockTooltip.mock.lastCall[0].label).toBe('test');
    expect(mockTooltip.mock.lastCall[0].color).toBe(color);
    /** FIXME Error: Avoid direct Node access. Prefer using the methods from Testing Library.  testing-library/no-node-access */
    expect(mockTooltip.mock.lastCall[0].children.type).toBe(icon);
    /** FIXME Error: Avoid direct Node access. Prefer using the methods from Testing Library.  testing-library/no-node-access */
    expect(mockTooltip.mock.lastCall[0].children.props.color).toBe(color);
  });

  test.each([
    ['warning', IconAlertTriangleFilled, '#f59f00'],
    ['critical', IconAlertCircleFilled, '#e03131'],
  ] as const)('color and fill-icon are changed depends on type: %s', (type, icon, color) => {
    render(<IconWithInfo label='test' type={type} />);
    expect(mockTooltip.mock.lastCall[0].label).toBe('test');
    expect(mockTooltip.mock.lastCall[0].color).toBe(color);
    /** FIXME Error: Avoid direct Node access. Prefer using the methods from Testing Library.  testing-library/no-node-access */
    expect(mockTooltip.mock.lastCall[0].children.type).toBe(icon);
    /** FIXME Error: Avoid direct Node access. Prefer using the methods from Testing Library.  testing-library/no-node-access */
    expect(mockTooltip.mock.lastCall[0].children.props.style.color).toBe(color);
  });
});
