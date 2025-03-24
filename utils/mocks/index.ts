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

/**
 * Initializes the Mock Service Worker (MSW) based on the environment.
 * If the code is running on the server-side, it starts the server.
 * If the code is running on the client-side, it starts the worker.
 *
 * @param callback - A callback function to be executed after the MSW is initialized.
 */
export const initMSW = async (callback: CallableFunction) => {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
    callback();
  } else {
    const { worker } = await import('./browser');
    await worker.start();
    callback();
  }
};
