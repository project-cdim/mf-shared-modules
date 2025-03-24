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

import { screen } from '@testing-library/react';
import { AxiosError } from 'axios';

import { render } from '@/shared-modules/__test__/test-utils';
import { ConfirmModal } from '@/shared-modules/components';

describe('ConfirmModal', () => {
  test('should execute submit when Yes button is clicked', () => {
    const submit = jest.fn();
    render(
      <ConfirmModal
        title='title'
        subTitle='subTitle'
        message='message'
        errorTitle='errorTitle'
        isModalOpen={true}
        closeModal={jest.fn()}
        error={undefined}
        submit={submit}
      />
    );
    const button = screen.getByRole('button', { name: 'Yes' });
    button.click();
    expect(submit).toHaveBeenCalled();
  });

  test('should display error message when error is present', () => {
    const error: AxiosError<{ code: string; message: string }> = {
      message: 'error message',
      //@ts-expect-error the minimum necessary
      response: {
        data: {
          message: 'error message',
          code: '400',
        },
      },
    };
    render(
      <ConfirmModal
        title='title'
        subTitle='subTitle'
        message='message'
        errorTitle='errorTitle'
        isModalOpen={true}
        closeModal={jest.fn()}
        error={error}
        submit={jest.fn()}
      />
    );
    const errorMessage = screen.getByText('error message');
    expect(errorMessage).toBeInTheDocument();
  });

  test('should display default error title when error title is not specified', () => {
    const error: AxiosError<{ code: string; message: string }> = {
      message: 'error message',
      //@ts-expect-error the minimum necessary
      response: {
        data: {
          message: 'error message',
          code: '400',
        },
      },
    };
    render(
      <ConfirmModal
        title='title'
        subTitle='subTitle'
        message='message'
        errorTitle={undefined}
        isModalOpen={true}
        closeModal={jest.fn()}
        error={error}
        submit={jest.fn()}
      />
    );
    const errorTitle = screen.getByText('Error');
    expect(errorTitle).toBeInTheDocument();
  });
});
