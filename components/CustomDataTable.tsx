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

'use client';

import { useEffect, useMemo, useState } from 'react';

import _ from 'lodash';
import {
  DataTable,
  DataTableColumn,
  DataTableColumnGroup,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';
import { useTranslations } from 'next-intl';

type CustomDataTableProps<T> = {
  /** Records. If you need to filter records with like table filters, this must have been filtered. */
  records: T[];
  /** Optional mantine-table props */
  otherTableProps?: Pick<DataTableProps<T>, 'rowExpansion' | 'rowStyle' | 'idAccessor'>;
  /** Column Accessor to be sorted */
  defaultSortColumn: DataTableColumn<T>['accessor'];
  /** Column sort direction (default: 'asc') */
  defaultSortDirection?: DataTableSortStatus<T>['direction'];
  /** Loading flag */
  loading: boolean;
  noPagination?: boolean;
} /** Either columns or groups is required, and columns and groups cannot be specified at the same time. */ /** Column information (Include filters)*/ & (
  | { columns: DataTableColumn<T>[]; groups?: never }
  /** Column Group information (Include filters)*/
  | { columns?: never; groups: DataTableColumnGroup<T>[] }
);

/**
 * Custom Data Table Component which do pagination and sorting.
 *
 * @param props {@link CustomDataTableProps}
 * @returns DataTable component which do pagination and sorting.
 */
export const CustomDataTable = <T,>({
  records,
  columns,
  groups,
  otherTableProps,
  defaultSortColumn,
  defaultSortDirection,
  loading,
  noPagination,
}: CustomDataTableProps<T>) => {
  const FIRST_PAGE = 1;
  const PAGE_SIZES = [10, 25, 50, 100];

  const t = useTranslations();

  const [page, setPage] = useState(FIRST_PAGE);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: defaultSortColumn,
    direction: defaultSortDirection !== undefined ? defaultSortDirection : 'asc',
  });

  const displayRecords = useMemo(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const sortedRecords = _.orderBy(records, [sortStatus.columnAccessor], [sortStatus.direction]);
    return _.slice(sortedRecords, from, to);
  }, [page, pageSize, sortStatus, records]);

  useEffect(() => {
    setPage(FIRST_PAGE);
  }, [pageSize, sortStatus, records]);

  const commonProps = {
    withTableBorder: true,
    borderRadius: 'sm',
    shadow: 'sm',
    striped: true,
    verticalSpacing: 'xs',
    minHeight: records.length > 0 ? 0 : 230,
    noRecordsText: t('No records'),
    fetching: loading,
    records: displayRecords,
    sortStatus: sortStatus,
    onSortStatusChange: setSortStatus,
  };

  const paginationProps = noPagination
    ? {}
    : {
        recordsPerPageLabel: t('Records per page'),
        recordsPerPageOptions: PAGE_SIZES,
        page: page,
        onPageChange: setPage,
        recordsPerPage: pageSize,
        onRecordsPerPageChange: setPageSize,
        totalRecords: records.length,
      };

  return groups ? (
    <DataTable groups={groups} withColumnBorders {...commonProps} {...otherTableProps} {...paginationProps} />
  ) : (
    <DataTable columns={columns} {...commonProps} {...otherTableProps} {...paginationProps} />
  );
};
