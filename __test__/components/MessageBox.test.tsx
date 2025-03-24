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
import UserEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox } from '@/shared-modules/components';

describe('MessageBox', () => {
  test('That the title is displayed', () => {
    render(<MessageBox title='Title' message='Message' type='error' />);

    const title = screen.getByText('Title', { exact: false });
    expect(title).toBeInTheDocument();
  });
  test('That the error message is displayed', () => {
    render(<MessageBox title='Title' message='Error Message' type='error' />);

    const message = screen.getByText('Error Message', { exact: false });
    expect(message).toBeInTheDocument();
  });
  test('That the message is displayed', () => {
    render(<MessageBox title='Title' message='Message' type='success' />);

    const message = screen.getByText('Message', { exact: false });
    expect(message).toBeInTheDocument();
  });
  test('That the callback function is called when the close button is clicked', async () => {
    const handleClose = jest.fn();
    render(
      <MessageBox
        title='Title'
        message='Message'
        type='success'
        close={handleClose}
      />
    );
    await UserEvent.click(screen.getByRole('button'));
    expect(handleClose).toHaveBeenCalled();
  });
});
