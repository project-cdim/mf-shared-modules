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
import { CustomDataTable } from '@/shared-modules/components';

const TOTAL_RECORDS = 110;
const records = Array.from(Array(TOTAL_RECORDS).keys(), (n) => n + 1).map((n) => ({
  id: n,
  name: `name${n}`,
  age: 20 + n,
}));
const columns = [
  { accessor: 'id', title: 'ID', sortable: true },
  { accessor: 'name', title: 'Name', sortable: true },
  { accessor: 'age', title: 'Age', sortable: true },
];
const groups = [
  {
    id: 'common',
    columns: [
      { accessor: 'id', title: 'ID', sortable: true },
      { accessor: 'name', title: 'Name', sortable: true },
    ],
  },
  {
    id: 'age',
    columns: [{ accessor: 'age', title: 'Age', sortable: true }],
  },
];

const commonProps = {
  records,
  defaultSortColumn: 'id',
  loading: false,
};

describe('CustomDataTable with pagination', () => {
  test('Table renders correctly with columns.', async () => {
    render(<CustomDataTable columns={columns} {...commonProps} />);

    const table = screen.getByRole('table');
    expect(table).toBeVisible();

    // 1 header + 10 records
    const headerAndRecords = screen.getAllByRole('row');
    expect(headerAndRecords).toHaveLength(11);

    // pagination parts
    [1, 2, 3, 4, 5, 10].forEach((n) => {
      const pageButton = screen.getByRole('button', { name: `${n}` });
      expect(pageButton).toBeVisible();
    });
    const currentDisaplyRecords = screen.getByText(`1 - 10 / ${TOTAL_RECORDS}`);
    expect(currentDisaplyRecords).toBeVisible();
    const recordsPerPage = screen.getByText('Records per page');
    expect(recordsPerPage).toBeVisible();
  });
  test('Table renders correctly with groups.', async () => {
    render(<CustomDataTable groups={groups} {...commonProps} />);

    const table = screen.getByRole('table');
    expect(table).toBeVisible();

    // 2 header + 10 records
    const headerAndRecords = screen.getAllByRole('row');
    expect(headerAndRecords).toHaveLength(12);

    // pagination parts
    [1, 2, 3, 4, 5, 10].forEach((n) => {
      const pageButton = screen.getByRole('button', { name: `${n}` });
      expect(pageButton).toBeVisible();
    });
    const currentDisaplyRecords = screen.getByText(`1 - 10 / ${TOTAL_RECORDS}`);
    expect(currentDisaplyRecords).toBeVisible();
    const recordsPerPage = screen.getByText('Records per page');
    expect(recordsPerPage).toBeVisible();
  });
  test('When the number of records is zero, Table renders correctly.', () => {
    render(<CustomDataTable {...{ ...commonProps, records: [], columns: columns }} defaultSortDirection='desc' />);

    const table = screen.getByRole('table');
    expect(table).toBeVisible();

    // 1 header + 1 raw for displaying no records message
    const headerAndRecords = screen.getAllByRole('row');
    expect(headerAndRecords).toHaveLength(2);

    // table raw + pagination left side
    const noDataMessages = screen.getAllByText('No records');
    expect(noDataMessages).toHaveLength(2);

    // pagination parts
    const recordsPerPage = screen.getByText('Records per page');
    expect(recordsPerPage).toBeVisible();
  });
});

describe('CustomDataTable without pagination', () => {
  test('Table renders correctly with columns.', async () => {
    render(<CustomDataTable columns={columns} {...commonProps} noPagination />);

    const table = screen.getByRole('table');
    expect(table).toBeVisible();

    // 1 header + 10 records
    const headerAndRecords = screen.getAllByRole('row');
    expect(headerAndRecords).toHaveLength(11);

    // pagination parts
    [1, 2, 3, 4, 5, 10].forEach((n) => {
      const pageButton = screen.queryByRole('button', { name: `${n}` });
      expect(pageButton).toBeNull();
    });
    const currentDisaplyRecords = screen.queryByText(`1 - 10 / ${TOTAL_RECORDS}`);
    expect(currentDisaplyRecords).toBeNull();
    const recordsPerPage = screen.queryByText('Records per page');
    expect(recordsPerPage).toBeNull();
  });
  test('Table renders correctly with groups.', async () => {
    render(<CustomDataTable groups={groups} {...commonProps} noPagination />);

    const table = screen.getByRole('table');
    expect(table).toBeVisible();

    // 2 header + 10 records
    const headerAndRecords = screen.getAllByRole('row');
    expect(headerAndRecords).toHaveLength(12);

    // pagination parts
    [1, 2, 3, 4, 5, 10].forEach((n) => {
      const pageButton = screen.queryByRole('button', { name: `${n}` });
      expect(pageButton).toBeNull();
    });
    const currentDisaplyRecords = screen.queryByText(`1 - 10 / ${TOTAL_RECORDS}`);
    expect(currentDisaplyRecords).toBeNull();
    const recordsPerPage = screen.queryByText('Records per page');
    expect(recordsPerPage).toBeNull();
  });
  test('When the number of records is zero, Table renders correctly.', () => {
    render(
      <CustomDataTable
        {...{ ...commonProps, records: [], columns: columns }}
        defaultSortDirection='desc'
        noPagination
      />
    );

    const table = screen.getByRole('table');
    expect(table).toBeVisible();

    // 1 header + 1 raw for displaying no records message
    const headerAndRecords = screen.getAllByRole('row');
    expect(headerAndRecords).toHaveLength(2);

    // table raw
    const noDataMessages = screen.getAllByText('No records');
    expect(noDataMessages).toHaveLength(1);

    // pagination parts
    const recordsPerPage = screen.queryByText('Records per page');
    expect(recordsPerPage).toBeNull();
  });
});
