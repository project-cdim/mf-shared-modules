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

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { SWRConfig } from 'swr';
import { cache } from 'swr/_internal';
import useSWRImmutable from 'swr/immutable';

import { render } from '@/shared-modules/__test__/test-utils';
import {
  ReloadHeader,
  ReloadHeaderProviderAndConfig,
} from '@/shared-modules/components';
import { fetcher } from '@/shared-modules/utils';

jest.mock('axios');

/**
 * If pass loadingOverwrite, ReloadHeader receive loadingOverwrite, else receive SWR's isValidating.
 * @param props - loadingOverwrite: boolean | undefined
 * @returns JSX.Element
 */
const TestComponent = (props: { loadingOverwrite?: boolean }) => {
  return (
    // Reset SWR cache between test cases
    <SWRConfig value={{ provider: () => new Map() }}>
      <ReloadHeaderProviderAndConfig>
        <TestChildComponent loadingOverwrite={props.loadingOverwrite} />
      </ReloadHeaderProviderAndConfig>
    </SWRConfig>
  );
};

const TestChildComponent = (props: { loadingOverwrite?: boolean }) => {
  const { data, mutate, isValidating } = useSWRImmutable('test', fetcher);
  const loading =
    props.loadingOverwrite === undefined
      ? isValidating
      : props.loadingOverwrite;
  return (
    <>
      <ReloadHeader mutate={mutate} loading={loading} />
      {data ? <div>{data.val}</div> : <div data-testid='empty'></div>}
    </>
  );
};

describe('ReloadHeader wrapped by ReloadHeaderProviderAndConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.delete('test'); // Clear the SWR cache
    jest.useRealTimers();
  });
  test('If loading, the reload button should be disabled with loader', () => {
    render(<TestComponent loadingOverwrite={true} />);
    const button = screen.getByRole('button', { name: 'Reload' });
    expect(button).toBeVisible();
    expect(button).toBeDisabled();
    expect(button).toDisplayLoader();
  });
  test('If before initial fetch, the reload button should be disabled with loader.', async () => {
    const mockDate = new Date('2024-01-01T12:00:00');
    jest.useFakeTimers({ now: mockDate });
    (axios.get as jest.Mock)
      .mockReset()
      .mockResolvedValue({ data: { val: 'first' } });

    render(<TestComponent />);

    // before initial fetch
    const button = screen.getByRole('button', { name: 'Reload' });
    expect(button).toBeVisible();
    expect(button).not.toBeEnabled();
    expect(button).toDisplayLoader();

    const value = await screen.findByText(mockDate.toLocaleString());
    expect(value).toBeInTheDocument();

    // after initial fetch
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
    await waitFor(() => expect(button).not.toDisplayLoader());
  });
  test('Label and value of Last fetched date and time should be displayed', async () => {
    const mockDate = new Date('2024-01-01T12:00:00');
    const mockDate2 = new Date('2024-01-01T12:00:10');
    jest.useFakeTimers({ now: mockDate });

    (axios.get as jest.Mock)
      .mockReset()
      .mockResolvedValue({ data: { val: 'first' } });

    render(<TestComponent />);

    expect.assertions(4);

    const label = screen.getByText('Last fetched');
    expect(label).toBeInTheDocument();

    let value = await screen.findByText(mockDate.toLocaleString());
    expect(value).toBeInTheDocument();

    jest.setSystemTime(mockDate2);

    // Check if last fetched date and time does not changed
    value = await screen.findByText(mockDate.toLocaleString());
    expect(value).toBeInTheDocument();
    await expect(screen.findByText(mockDate2.toLocaleString())).rejects.toThrow(
      'Unable to find an element with the text'
    );
  });
  test('If click the reload button, last fetched datetime and contents should be updated', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const mockDate = new Date('2024-01-01T12:00:00');
    const mockDate2 = new Date('2024-01-01T12:00:10');
    const mockDate3 = new Date('2024-01-01T12:00:20');
    jest.useFakeTimers({ now: mockDate });

    (axios.get as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce({ data: { val: 'first' } })
      .mockResolvedValueOnce({ data: { val: 'second' } })
      .mockRejectedValueOnce({
        message: 'error message',
        response: {
          data: {
            message: 'error message',
            code: 400,
          },
        },
      });

    render(<TestComponent />);

    expect.assertions(9);

    const reloadButton = screen.getByRole('button', { name: 'Reload' });

    // Initial Render(API Success)
    let lastFetched = await screen.findByText(mockDate.toLocaleString());
    expect(lastFetched).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const firstVal = await screen.findByText('first');
    expect(firstVal).toBeInTheDocument();

    jest.setSystemTime(mockDate2);

    // First Click(API Success)
    await user.click(reloadButton);
    lastFetched = await screen.findByText(mockDate2.toLocaleString());
    expect(lastFetched).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    const secondVal = screen.getByText('second');
    expect(secondVal).toBeInTheDocument();

    jest.setSystemTime(mockDate3);

    // Second Click(API Fail)
    await user.click(reloadButton);
    lastFetched = await screen.findByText(mockDate3.toLocaleString());
    expect(lastFetched).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    const empty = await screen.findByTestId('empty');
    expect(empty).toBeInTheDocument();
  });
});
