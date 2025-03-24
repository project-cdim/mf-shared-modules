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

import { initMSW } from '@/shared-modules/utils/mocks/';

jest.mock('@/shared-modules/utils/mocks/server', () => ({
  server: {
    listen: jest.fn(),
  },
}));

jest.mock('@/shared-modules/utils/mocks/browser', () => ({
  worker: {
    start: jest.fn(() => Promise.resolve()),
  },
}));

describe('initMSW function', () => {
  let originalWindow: typeof global.window;

  beforeAll(() => {
    originalWindow = global.window;
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.window = originalWindow;
  });

  test('In the case of server-side, call server.listen', async () => {
    const originalWindow = global.window;

    delete (global as any).window;
    const callbackMock = jest.fn();
    await initMSW(callbackMock);

    expect(require('@/shared-modules/utils/mocks/server').server.listen).toHaveBeenCalled();
    expect(callbackMock).toHaveBeenCalled();

    global.window = originalWindow; // Restore to original state
  });

  test('In the case of client-side, call worker.start', async () => {
    const callbackMock = jest.fn();
    await initMSW(callbackMock);

    expect(require('@/shared-modules/utils/mocks/browser').worker.start).toHaveBeenCalled();
    expect(callbackMock).toHaveBeenCalled();
  });
});
