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

import LuigiClient from '@luigi-project/client';
import { act, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageLink } from '@/shared-modules/components';

jest.mock('@luigi-project/client', () => ({
  linkManager: jest.fn(() => ({
    withParams: jest.fn(),
    navigate: jest.fn(),
  })),
  addInitListener: jest.fn(),
}));
const mockWithParams = jest.fn();
const mockNavigate = jest.fn();
const mockAddInitListener = jest.fn();
describe('PageLink Component', () => {
  beforeEach(() => {
    // Run before each test
    jest.clearAllMocks();
    (LuigiClient.linkManager as unknown as jest.Mock).mockImplementation(() => ({
      withParams: mockWithParams,
      navigate: mockNavigate,
    }));

    (LuigiClient.addInitListener as unknown as jest.Mock).mockImplementation(mockAddInitListener);
  });

  test('should render children correctly', () => {
    render(<PageLink path='/test'>Click me!</PageLink>);
    expect(screen.getByText('Click me!')).toBeInTheDocument();
  });

  test('should render children correctly when path is undefined', () => {
    render(<PageLink>Click me!</PageLink>);
    expect(screen.getByText('Click me!')).toBeInTheDocument();
  });

  test('should call linkManager with correct parameters on click', async () => {
    render(
      <PageLink path='/test' query={{ param1: 'value1' }}>
        Click me!
      </PageLink>
    );
    act(() => {
      // Call luigiClient.addInitListener
      mockAddInitListener.mock.calls[0][0]();
    });

    await UserEvent.click(screen.getByText('Click me!'));

    expect(LuigiClient.linkManager).toHaveBeenCalled();
    expect(mockWithParams).toHaveBeenCalledWith({ param1: 'value1' });
    expect(mockNavigate).toHaveBeenCalledWith('/test');
  });

  test('should not call withParams when query is not provided', async () => {
    render(<PageLink path='/test'>Click me!</PageLink>);
    act(() => {
      // Call luigiClient.addInitListener
      mockAddInitListener.mock.calls[0][0]();
    });
    await UserEvent.click(screen.getByText('Click me!'));

    expect(LuigiClient.linkManager).toHaveBeenCalled();
    expect(mockWithParams).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/test');
  });
});
