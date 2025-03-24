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

import { act, render, screen } from '@testing-library/react';

import { useLoading } from '@/shared-modules/utils/hooks';

describe('useLoading Custom Hook', () => {
  function TestComponent(props: { isValidating: boolean }) {
    const loading = useLoading(props.isValidating);
    return loading ? <div>loading...</div> : <div>not loading</div>;
  }

  test('should set loading to true when isValidating is true', () => {
    render(<TestComponent isValidating={true} />);
    expect(screen.getByText('loading...')).toBeInTheDocument();
  });

  test('should set loading to false after 200ms when isValidating is false', async () => {
    jest.useFakeTimers();

    render(<TestComponent isValidating={false} />);
    expect(screen.getByText('not loading')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText('not loading')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('not loading')).toBeInTheDocument();

    jest.useRealTimers();
  });
});
