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

import { render, screen } from '@testing-library/react';

import { useMSW } from '@/shared-modules/utils/hooks/useMSW';
import * as mocks from '@/shared-modules/utils/mocks';

jest.mock('@/shared-modules/utils/mocks', () => ({
  initMSW: jest.fn((callback) => callback()),
}));

describe('useMSW custom hook', () => {
  function TestComponent() {
    const isMswInitializing = useMSW();
    return isMswInitializing ? (
      <div>initializing...</div>
    ) : (
      <div>initialized</div>
    );
  }

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks(); // Reset the state of the mock function
  });

  test('Call initMSW in the development environment', () => {
    // Mock process.env
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NODE_ENV: 'development' },
    });

    render(<TestComponent />);
    expect(screen.getByText('initialized')).toBeInTheDocument();
    expect(mocks.initMSW).toHaveBeenCalled();
  });

  test('Call initMSW when NEXT_PUBLIC_USE_MSW is true', () => {
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NEXT_PUBLIC_USE_MSW: 'true' },
    });

    render(<TestComponent />);
    expect(screen.getByText('initialized')).toBeInTheDocument();
    expect(mocks.initMSW).toHaveBeenCalled();
  });

  test('Otherwise, do not call initMSW', () => {
    Object.defineProperty(process, 'env', {
      value: {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_PUBLIC_USE_MSW: 'false',
      },
    });

    render(<TestComponent />);
    expect(screen.getByText('initialized')).toBeInTheDocument();
    expect(mocks.initMSW).not.toHaveBeenCalled();
  });
});
