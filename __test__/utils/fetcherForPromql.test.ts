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

import axios from 'axios';

import { fetcherForPromql, fetcherForPromqlByPost } from '@/shared-modules/utils';

jest.mock('axios');
const mockDate = new Date(1704110400000); // 2024/01/01 12:00:00
const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

describe('fetcherForPromql', () => {
  test('fetch data from the api with axios', async () => {
    const mockRes = {
      data: {
        id: 1,
      },
      request: {
        responseURL: 'http://localhost:3000',
      },
    };

    (axios.get as unknown as jest.Mock).mockResolvedValue(mockRes);

    const data = await fetcherForPromql('dummy.url');

    expect(axios.get).toHaveBeenCalledWith(
      'dummy.url&start=2023-12-01T12:00:00.000Z&end=2024-01-01T12:00:00.000Z&step=1h'
    );
    expect(data).toEqual({ id: 1, url: 'http://localhost:3000' });

    // Clean up date mock
    spy.mockReset();
    spy.mockRestore();
  });

  test('fetch data from the api with axios by post', async () => {
    const mockRes = {
      id: 1,
    };
    (axios.post as jest.Mock).mockResolvedValue({ data: mockRes });

    const data = await fetcherForPromqlByPost('', new URLSearchParams());
    expect(data).toEqual(mockRes);
  });
});
