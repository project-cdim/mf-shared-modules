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

import { Dispatch, SetStateAction } from 'react';

import { ActionIcon, ComboboxData, Group, MultiSelect, NumberInput, NumberInputProps, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export const TextInputForTableFilter = (props: { label: string; value: string; setValue: (p: string) => void }) => {
  return (
    <TextInput
      label={props.label}
      placeholder={props.label}
      leftSection={<IconSearch size={16} />}
      value={props.value}
      rightSection={
        <ActionIcon size='sm' variant='transparent' c='dimmed' onClick={() => props.setValue('')}>
          <IconX size={14} />
        </ActionIcon>
      }
      onChange={(e) => props.setValue(e.currentTarget.value)}
    />
  );
};

export const MultiSelectForTableFilter = (props: {
  label: string;
  options: ComboboxData;
  value: string[];
  setValue: (p: string[]) => void;
}) => {
  return (
    <MultiSelect
      label={props.label}
      placeholder={props.label}
      data={props.options}
      value={props.value}
      onChange={(value: string[]) => props.setValue(value)}
      leftSection={<IconSearch size={16} />}
      clearable
      clearButtonProps={{ tabIndex: 0 }}
      searchable
    />
  );
};

export type NumberRange = [number | undefined, number | undefined];

export const NumberRangeForTableFilter = (props: {
  values: NumberRange;
  setValues: Dispatch<SetStateAction<NumberRange>>;
}) => {
  const t = useTranslations();
  const { values, setValues } = props;
  const MAX_NUMBER_DISPLAY_INPUT_CONTROL = Number.MAX_SAFE_INTEGER - 1;
  const FROM = 0;
  const TO = 1;

  const commonProps: NumberInputProps = {
    allowDecimal: false,
    allowNegative: false,
    // prevent user from entering a number that is converted to string type by NumberInput
    isAllowed: ({ value: val }) => Number(val) <= MAX_NUMBER_DISPLAY_INPUT_CONTROL || val === '',
  };

  // A value of NumberInput take string in some cases. See the details: https://mantine.dev/core/number-input/#value-type
  return (
    <Group>
      <NumberInput
        label={t('From')}
        placeholder={t('From')}
        value={values[FROM] ?? ''}
        onChange={(val) => {
          if (val === '') {
            setValues((prev) => [undefined, prev[TO]]);
          } else if (Number(val) === 0) {
            setValues((prev) => [0, prev[TO]]);
            // @ts-ignore: val must be number here because of isAllowed function
          } else setValues((prev) => [val, prev[TO]]);
        }}
        max={values[TO] ?? MAX_NUMBER_DISPLAY_INPUT_CONTROL}
        {...commonProps}
      />
      <NumberInput
        label={t('To')}
        placeholder={t('To')}
        value={values[TO] ?? ''}
        onChange={(val) => {
          if (val === '') {
            setValues((prev) => [prev[FROM], undefined]);
          } else if (Number(val) === 0) {
            setValues((prev) => [prev[FROM], 0]);
            // @ts-ignore: val must be number here because of isAllowed function
          } else setValues((prev) => [prev[FROM], val]);
        }}
        min={values[FROM]}
        max={MAX_NUMBER_DISPLAY_INPUT_CONTROL}
        {...commonProps}
      />
    </Group>
  );
};
