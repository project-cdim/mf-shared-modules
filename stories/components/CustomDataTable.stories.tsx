import type { Meta, StoryObj } from '@storybook/react';
import { CustomDataTable, LongSentences } from '@/shared-modules/components';
import 'mantine-datatable/styles.layer.css';
import { generateUUID } from '@/shared-modules/utils/dummy-data/generateUUID';

type Story = StoryObj<typeof CustomDataTable>;

const meta: Meta<typeof CustomDataTable> = {
  title: 'Shared-Modules/components/CustomDataTable',
  component: CustomDataTable,
  // tags: ['autodocs'],
};

export default meta;

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

export const Demo: Story = {
  args: { columns: columns, ...commonProps },
};

export const DemoWithGroup: Story = {
  args: { groups: groups, ...commonProps },
};

const longSentenceRecords = Array.from(Array(TOTAL_RECORDS).keys(), () => ({
  id: generateUUID(),
  description: `This is a very long description for this record. It is intentionally verbose to test how the table handles long text. The description continues with even more details to ensure that the text is sufficiently lengthy for testing purposes. This includes additional information about the record, its context, and any other relevant details that might be useful for display or testing scenarios.`,
}));

const longSentenceColumns = [
  { accessor: 'id', title: 'ID', sortable: true, noWrap: true },
  {
    accessor: 'description',
    title: 'Description',
    sortable: false,
    render: (record: unknown) => <LongSentences text={(record as { description: string }).description} />,
  },
];

/** Using the LongSentences component. The ID column has `noWrap: true` specified. */
export const DemoWithLongSentences: Story = {
  args: {
    columns: longSentenceColumns,
    records: longSentenceRecords,
  },
};
