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

import { useState } from 'react';

import { screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';
import {
  MultiSelectForTableFilter,
  NumberRange,
  NumberRangeForTableFilter,
  TextInputForTableFilter,
} from '@/shared-modules/components';

const TestInput = (props: { label: string; value: string }) => {
  const [val, setVal] = useState<string>(props.value);
  return <TextInputForTableFilter label={props.label} value={val} setValue={setVal} />;
};

const TestMultiSelect = (props: { label: string; options: { value: string; label: string }[]; value: string[] }) => {
  const [val, setVal] = useState<string[]>(props.value);
  return <MultiSelectForTableFilter label={props.label} options={props.options} value={val} setValue={setVal} />;
};

describe('TableFilters', () => {
  test('TextInput renders and respond user events correctly', async () => {
    const user = UserEvent.setup();
    const props = {
      label: 'test',
      value: 'val',
    };

    render(<TestInput {...props} />);
    const input = screen.getByLabelText('test');
    expect(input).toBeVisible();
    expect(input).toHaveAttribute('placeholder', 'test');
    expect(input).toHaveValue('val');
    expect(input).toHaveDisplayValue('val');

    const xButton = screen.getByRole('button');
    expect(xButton).toBeVisible();

    await user.click(xButton);
    expect(input).toHaveValue('');

    await user.click(input);
    await user.keyboard('new');
    expect(input).toHaveValue('new');
    expect(input).toHaveDisplayValue('new');
  });

  test('MultiSelect renders and respond user events correctly', async () => {
    const user = UserEvent.setup();
    const props = {
      label: 'test',
      options: [
        { value: 'val01', label: 'label01' },
        { value: 'val02', label: 'label02' },
        { value: 'val03', label: 'label03' },
      ],
      value: ['val01'],
    };

    render(<TestMultiSelect {...props} />);

    // input field
    const input = screen.getAllByLabelText('test')[0];
    expect(input).toBeVisible();
    expect(input).toHaveAttribute('placeholder', 'test');

    // options list
    const select = screen.getAllByLabelText('test')[1];
    expect(select).toHaveTextContent('label01');
    expect(select).toHaveTextContent('label02');
    expect(select).toHaveTextContent('label03');

    // selected options
    let selected01 = screen.getAllByText('label01');
    let selected02 = screen.getAllByText('label02');
    let selected03 = screen.getAllByText('label03');
    // selected items cat not be get element by default matcher, so check length. Each option list contains text.
    expect(selected01).toHaveLength(2);
    expect(selected02).toHaveLength(1);
    expect(selected03).toHaveLength(1);

    // search options
    await user.click(input);
    await user.keyboard('02');
    expect(input).toHaveValue('02');
    expect(input).toHaveDisplayValue('02');
    expect(select).not.toHaveTextContent('label01');
    expect(select).toHaveTextContent('label02');
    expect(select).not.toHaveTextContent('label03');

    // select options
    await user.click(screen.getByText('label02'));
    selected01 = screen.getAllByText('label01');
    selected02 = screen.getAllByText('label02');
    selected03 = screen.getAllByText('label03');
    // selected items cat not be get element by default matcher, so check length. Each option list contains text.
    expect(selected01).toHaveLength(2);
    expect(selected02).toHaveLength(2);
    expect(selected03).toHaveLength(1);
  });

  test('NumberRange renders empty inputs when values are undefined', () => {
    const setter = jest.fn();
    const props = {
      values: [undefined, undefined] as NumberRange,
      setValues: setter,
    };

    render(<NumberRangeForTableFilter {...props} />);

    const fromInput = screen.getByLabelText('From');
    const toInput = screen.getByLabelText('To');

    expect(fromInput).toHaveAttribute('placeholder', 'From');
    expect(toInput).toHaveAttribute('placeholder', 'To');

    expect(fromInput).toHaveValue('');
    expect(toInput).toHaveValue('');
  });

  test('NumberRange renders and respond user events correctly', async () => {
    const user = UserEvent.setup();
    const setter = jest.fn();
    const props = {
      values: [10, 20] as NumberRange,
      setValues: setter,
    };

    render(<NumberRangeForTableFilter {...props} />);

    const fromInput = screen.getByLabelText('From');
    const toInput = screen.getByLabelText('To');

    expect(fromInput).toHaveAttribute('placeholder', 'From');
    expect(toInput).toHaveAttribute('placeholder', 'To');

    expect(fromInput).toBeVisible();
    expect(toInput).toBeVisible();

    expect(fromInput).toHaveValue('10');
    expect(toInput).toHaveValue('20');

    await user.clear(fromInput);
    setter.mock.lastCall[0]([10, 20]);
    await user.type(fromInput, '15');
    setter.mock.lastCall[0]([undefined, 20]);
    expect(fromInput).toHaveValue('15');

    await user.clear(toInput);
    setter.mock.lastCall[0]([15, 20]);
    await user.type(toInput, '25');
    setter.mock.lastCall[0]([15, undefined]);
    expect(toInput).toHaveValue('25');

    await user.clear(fromInput);
    await user.type(fromInput, '30');
    expect(fromInput).toHaveValue('30');
    expect(toInput).toHaveValue('25');

    await user.clear(toInput);
    await user.type(toInput, '5');
    expect(toInput).toHaveValue('5');
    expect(fromInput).toHaveValue('30');

    await user.clear(fromInput);
    await user.type(fromInput, 'hoge');
    expect(fromInput).toHaveValue('');
    expect(toInput).toHaveValue('5');

    await user.clear(toInput);
    await user.type(toInput, 'hoge');
    expect(toInput).toHaveValue('');
    expect(fromInput).toHaveValue('');

    await user.clear(fromInput);
    await user.clear(toInput);

    await user.type(fromInput, '000');
    expect(fromInput).toHaveValue('000');
    setter.mock.lastCall[0]([0, undefined]);

    await user.type(toInput, '000');
    expect(toInput).toHaveValue('000');
    setter.mock.lastCall[0]([0, 0]);

    await user.clear(fromInput);
    await user.clear(toInput);
    expect(fromInput).toHaveValue('');
    expect(toInput).toHaveValue('');

    // The value 9007199254740990 can be inputted because it is precisely equal to Number.MAX_SAFE_INTEGER - 1.
    await user.clear(fromInput);
    await user.type(fromInput, '9007199254740990');
    expect(fromInput).toHaveValue('9007199254740990');
    setter.mock.lastCall[0]([9007199254740990, undefined]);

    // The value 9007199254740991 cannot be inputted because it exceeds Number.MAX_SAFE_INTEGER - 1.
    await user.clear(fromInput);
    await user.type(fromInput, '9007199254740991');
    expect(fromInput).toHaveValue('900719925474099');
    setter.mock.lastCall[0]([900719925474099, undefined]);
  });
});
