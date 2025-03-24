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
import { Icon } from '@/shared-modules/components';
import { APPStatus } from '@/shared-modules/types';

jest.mock('@tabler/icons-react', () => ({
  IconAlertCircleFilled: jest.fn(() => <div>IconAlertCircleFilled</div>),
  IconAlertTriangleFilled: jest.fn(() => <div>IconAlertTriangleFilled</div>),
  IconBan: jest.fn(() => <div>IconBan</div>),
  IconCheck: jest.fn(() => <div>IconCheck</div>),
  IconPlayerPause: jest.fn(() => <div>IconPlayerPause</div>),
}));

describe('Icon Component', () => {
  test('renders the correct icon for status "Critical"', () => {
    render(<Icon status='Critical' />);
    expect(screen.getByText('IconAlertCircleFilled')).toBeInTheDocument();
  });

  test('renders the correct icon for status "Failed"', () => {
    render(<Icon status='Failed' />);
    expect(screen.getByText('IconAlertCircleFilled')).toBeInTheDocument();
  });

  test('renders the correct icon for status "Warning"', () => {
    render(<Icon status='Warning' />);
    expect(screen.getByText('IconAlertTriangleFilled')).toBeInTheDocument();
  });

  test('renders the correct icon for status "Suspended"', () => {
    render(<Icon status='Suspended' />);
    expect(screen.getByText('IconPlayerPause')).toBeInTheDocument();
  });

  test('renders the correct icon for status "OK"', () => {
    render(<Icon status='OK' />);
    expect(screen.getByText('IconCheck')).toBeInTheDocument();
  });

  test('renders the correct icon for status "Disabled"', () => {
    render(<Icon status='Disabled' />);
    expect(screen.getByText('IconBan')).toBeInTheDocument();
  });

  test('renders the correct icon for status "Available"', () => {
    render(<Icon status='Available' />);
    expect(screen.getByText('IconCheck')).toBeInTheDocument();
  });

  test('renders the correct icon for status "Unavailable"', () => {
    render(<Icon status='Unavailable' />);
    expect(screen.getByText('IconBan')).toBeInTheDocument();
  });

  test('renders the correct icon for status "All"', () => {
    render(<Icon status='All' />);
    expect(screen.queryByText(/Icon/)).not.toBeInTheDocument();
  });

  test('renders the correct icon for status undefined', () => {
    render(<Icon status={undefined as unknown as APPStatus} />);
    expect(screen.queryByText(/Icon/)).not.toBeInTheDocument();
  });
});
