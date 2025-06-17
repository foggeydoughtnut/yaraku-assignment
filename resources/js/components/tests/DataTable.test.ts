import { createColumnHelper } from '@tanstack/vue-table';
import { mount } from '@vue/test-utils';
import { describe } from 'node:test';
import { expect, test } from 'vitest';
import DataTable from '../DataTable.vue';

type TestingDatapoint = {
  id: number;
  name: string;
  value: number;
};
const testData: TestingDatapoint[] = [
  {
    id: 0,
    name: 'testing 0',
    value: 20,
  },
  {
    id: 1,
    name: 'testing 1',
    value: 75,
  },
  {
    id: 2,
    name: 'testing 2',
    value: 5,
  },
];
const columnHelper = createColumnHelper<TestingDatapoint>();
const testingColumns = [
  columnHelper.accessor('id', {
    id: 'id',
    cell: (info) => info.getValue(),
    header: 'Id',
  }),
  columnHelper.accessor('name', {
    id: 'name',
    cell: (info) => info.getValue(),
    header: 'Name',
  }),
  columnHelper.accessor('value', {
    id: 'value',
    cell: (info) => info.getValue(),
    header: 'Value',
  }),
];

test('Can mount DataTable', () => {
  const wrapper = mount(DataTable, {
    props: {
      data: [],
      columns: [],
    },
  });
  expect(wrapper).toBeDefined();
});

test('Columns passed in match what we expect', () => {
  const wrapper = mount(DataTable, {
    props: {
      data: testData,
      columns: testingColumns,
    },
  });
  expect(wrapper).toBeDefined();
  const headers = wrapper.findAll('th');
  expect(headers.at(0)?.text()).toEqual('Id');
  expect(headers.at(1)?.text()).toEqual('Name');
  expect(headers.at(2)?.text()).toEqual('Value');
});

test('Data passed in is displayed as we expect', () => {
  const wrapper = mount(DataTable, {
    props: {
      data: testData,
      columns: testingColumns,
    },
  });
  expect(wrapper).toBeDefined();
  const tableBody = wrapper.find('tbody');
  expect(tableBody).toBeDefined();
  const rows = tableBody.findAll('tr');
  for (const [rowIdx, row] of rows.entries()) {
    const formattedTestDataString = `${testData.at(rowIdx)?.id}${testData.at(rowIdx)?.name}${testData.at(rowIdx)?.value}`;
    expect(row.text()).toEqual(formattedTestDataString);
  }
});

test('Setting filterValue filters the correct values', () => {
  const wrapper = mount(DataTable, {
    props: {
      data: testData,
      columns: testingColumns,
      filterValue: 'testing 1',
    },
  });
  expect(wrapper).toBeDefined();
  const tableBody = wrapper.find('tbody');
  expect(tableBody).toBeDefined();
  const rows = tableBody.findAll('tr');
  expect(rows.at(0)?.text()).toContain('testing 1');
  expect(rows.length).toEqual(1);
});

describe('Default sorting tests', () => {
  test('Setting default ascending sorting works as expected', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: testData,
        columns: testingColumns,
        defaultSorting: [{ id: 'id', desc: false }],
      },
    });
    expect(wrapper).toBeDefined();
    const tbodyEl = wrapper.find('tbody');
    const rows = tbodyEl.findAll('tr');
    for (let i = 0; i < rows.length; i++) {
      expect(rows.at(i)?.findAll('td').at(0)?.text()).toEqual(testData.at(i)?.id.toString());
    }
  });

  test('Setting default descending sorting works as expected', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: testData,
        columns: testingColumns,
        defaultSorting: [{ id: 'id', desc: true }],
      },
    });
    expect(wrapper).toBeDefined();
    const tbodyEl = wrapper.find('tbody');
    const rows = tbodyEl.findAll('tr');
    let testDataIndex = rows.length - 1;
    for (let i = 0; i < rows.length; i++) {
      expect(rows.at(i)?.findAll('td').at(0)?.text()).toEqual(testData.at(testDataIndex)?.id.toString());
      testDataIndex--;
    }
  });
});
