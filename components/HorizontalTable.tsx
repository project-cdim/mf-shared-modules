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

import { ReactNode } from 'react';

import { Stack, Table, Title } from '@mantine/core';

import { CardLoading } from '@/shared-modules/components';
import { useColorStyles } from '@/shared-modules/styles/styles';

/**
 * A component that renders a horizontal table with loading state and optional title.
 *
 * @param props - The properties object.
 * @param props.title - The optional title of the table.
 * @param props.tableData - The data to be displayed in the table. Each object in the array should have the following properties:
 * @param props.tableData.columnName - The name of the column.
 * @param props.tableData.value - The value to be displayed in the column.
 * @param props.tableData.hide - Optional flag to hide the row.
 * @param props.loading - Flag indicating whether the table is in a loading state.
 * @param props.disabled - Flag indicating whether the table is disabled. When disabled, the table will have a gray background and font color.
 *
 * @returns The rendered horizontal table component.
 */
export const HorizontalTable = ({
  title,
  tableData,
  loading,
  disabled = false,
  maw,
}: {
  title?: string;
  tableData: { columnName: string; value: ReactNode; hide?: boolean }[];
  loading: boolean;
  disabled?: boolean;
  maw?: string;
}) => {
  const { Th, Tbody, Td, Tr } = Table;

  const { gray } = useColorStyles();
  const backgroundColorStyle = disabled ? { root: { backgroundColor: '#f0f0f0' } } : {};
  const fontColorStyle = disabled ? { color: gray.color } : {};

  return (
    <Stack>
      {title && (
        <Title order={2} fz='lg'>
          {title}
        </Title>
      )}
      <CardLoading withBorder maw={maw ? maw : '51em'} loading={loading} styles={backgroundColorStyle}>
        <Table
          styles={{
            th: { width: '11em' },
            table: fontColorStyle,
          }}
        >
          <Tbody>
            {tableData.map(
              (row, idx) =>
                !row.hide && (
                  <Tr key={`${idx}-${row.columnName}`}>
                    <Th>{row.columnName}</Th>
                    <Td>{row.value}</Td>
                  </Tr>
                )
            )}
          </Tbody>
        </Table>
      </CardLoading>
    </Stack>
  );
};
