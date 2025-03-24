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

import { screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';
import { ErrorBoundary } from '@/shared-modules/components';

jest.mock('@/shared-modules/components/MessageBox', () => {
  return {
    MessageBox: () => (
      <div data-testid='mockedMessageBox'>Mocked MessageBox</div>
    ),
  };
});

const ThrowError = () => {
  throw new Error('Test error');
  return <div>Should not render this</div>;
};

describe('<ErrorBoundary />', () => {
  test('should render child component successfully', () => {
    render(
      <ErrorBoundary>
        <div data-testid='childComponent'>Child Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('childComponent')).toBeInTheDocument();
  });

  test('should display error UI when an error occurs', () => {
    console.error = jest.fn();
    console.log = jest.fn();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('mockedMessageBox')).toBeInTheDocument();
    const reloadButton = screen.getByRole('button', { name: 'Reload' });
    expect(reloadButton).toBeInTheDocument();
  });

  test('should reset error state when reload button is clicked', async () => {
    console.error = jest.fn();
    console.log = jest.fn();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: 'Reload' });
    await UserEvent.click(reloadButton);
    expect(screen.getByTestId('mockedMessageBox')).toBeInTheDocument();
  });
});
