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

import { act, renderHook } from '@testing-library/react';

import { useConfirmModal } from '@/shared-modules/utils/hooks';

describe('useConfirmModal', () => {
  test('isModalOpen becomes true when openModal is called', () => {
    const { result } = renderHook(useConfirmModal);
    const openModal = result.current.openModal;
    expect(result.current.isModalOpen).toBe(false);
    act(openModal);
    expect(result.current.isModalOpen).toBe(true);
  });
  test('isModalOpen becomes false when closeModal is called', () => {
    const { result } = renderHook(useConfirmModal);
    const openModal = result.current.openModal;
    const closeModal = result.current.closeModal;
    act(() => openModal());
    expect(result.current.isModalOpen).toBe(true);
    act(() => closeModal());
    expect(result.current.isModalOpen).toBe(false);
  });
  test('error is set when setError is called', () => {
    const { result } = renderHook(useConfirmModal);
    const setError = result.current.setError;

    const mockError = {
      message: 'error message',
      response: {
        data: {
          message: 'error message',
          code: 400,
        },
      },
    };
    expect(result.current.error).toBeUndefined();
    // @ts-expect-error the minimum necessary
    act(() => setError(mockError));
    expect(result.current.error).toBe(mockError);
  });
});
