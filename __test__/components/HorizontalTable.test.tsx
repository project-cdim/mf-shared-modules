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

import { render } from '@/shared-modules/__test__/test-utils';
import { HorizontalTable } from '@/shared-modules/components/HorizontalTable';

describe('HorizontalTable', () => {
  const tableData = [
    { columnName: 'Name', value: 'John Doe' },
    { columnName: 'Age', value: 30 },
    { columnName: 'Email', value: 'john.doe@example.com' },
  ];

  test('renders the title when provided', () => {
    render(<HorizontalTable title='User Info' tableData={tableData} loading={false} />);
    expect(screen.getByText('User Info')).toBeInTheDocument();
  });

  test('does not render the title when not provided', () => {
    render(<HorizontalTable tableData={tableData} loading={false} />);
    expect(screen.queryByText('User Info')).not.toBeInTheDocument();
  });

  test('renders table data correctly', () => {
    render(<HorizontalTable tableData={tableData} loading={false} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  test('does not render hidden rows', () => {
    const hiddenTableData = [...tableData, { columnName: 'Hidden', value: 'Should not be visible', hide: true }];
    render(<HorizontalTable tableData={hiddenTableData} loading={false} />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    expect(screen.queryByText('Should not be visible')).not.toBeInTheDocument();
  });

  test('applies disabled styles when disabled', () => {
    const { container } = render(<HorizontalTable tableData={tableData} loading={false} disabled />);

    const card = container.querySelector('.mantine-Card-root');
    expect(card).toHaveStyle('background-color: rgb(240, 240, 240)');
    const table = screen.getByRole('table');
    expect(table).toHaveStyle('color: rgb(134, 142, 150)'); // gray color
  });

  test('shows loading state when loading', () => {
    const { container } = render(<HorizontalTable tableData={tableData} loading />);
    expect(container).toDisplayLoader();
  });

  test("table width is modifiable by 'maw' prop", () => {
    const { container } = render(<HorizontalTable tableData={tableData} loading={false} maw='40em' />);
    const card = container.querySelector('.mantine-Card-root');
    expect(card).toHaveStyle('max-width: 40em');
  });
});
