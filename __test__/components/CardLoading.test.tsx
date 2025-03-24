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

import { render } from '@/shared-modules/__test__/test-utils';
import { CardLoading } from '@/shared-modules/components';

describe('CardLoading', () => {
  test('If children are provided, the CardLoading should render the children', () => {
    render(
      <CardLoading loading={false}>
        <div data-testid='child'>Test</div>
      </CardLoading>
    );
    const child = screen.getByTestId('child');
    expect(child).toBeVisible();
    expect(child).toHaveTextContent('Test');
  });
  test('If loading is true, the CardLoading should display a loading overlay', () => {
    const { container } = render(<CardLoading loading={true} />);
    expect(container).toDisplayLoader();
  });
  test('If loading is false, the CardLoading should not display a loading overlay', () => {
    const { container } = render(<CardLoading loading={false} />);
    expect(container).not.toDisplayLoader();
  });
});
