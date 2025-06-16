import { Author } from '@/types';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AuthorTable from '../AuthorTable.vue';

const testAuthorData: Author[] = [
  {
    id: 'testId1',
    name: 'testAuthor1',
    created_at: '2025-06-13T04:21:57.000000Z',
    updated_at: '2025-06-13T04:21:57.000000Z',
    deleted_at: null,
  },
  {
    id: 'testId2',
    name: 'testAuthor2',
    created_at: '2025-06-13T04:22:57.000000Z',
    updated_at: '2025-06-13T04:22:57.000000Z',
    deleted_at: null,
  },
  {
    id: 'testId3',
    name: 'testAuthor3',
    created_at: '2025-06-13T04:23:57.000000Z',
    updated_at: '2025-06-13T04:23:57.000000Z',
    deleted_at: null,
  },
];

describe('AuthorTable tests', () => {
  it('has the expected columns present', () => {
    const wrapper = mount(AuthorTable, {
      props: {
        data: testAuthorData,
      },
    });
    expect(wrapper).toBeDefined();
    const header = wrapper.find('thead');
    expect(header).toBeDefined();
    const columnEls = header.findAll('th');
    expect(columnEls.length).toBe(2);
    expect(columnEls.at(0)?.text()).toBe('Author Name');
  });

  it('emits author on edit button click', async () => {
    const wrapper = mount(AuthorTable, {
      props: {
        data: testAuthorData,
      },
    });
    expect(wrapper).toBeDefined();
    const tbodyEl = wrapper.find('tbody');
    const row = tbodyEl.find('tr');
    const columns = row.findAll('td');
    const editButton = columns.at(1)?.find('button');
    expect(wrapper.emitted('editAuthor')).not.toBeDefined();
    await editButton?.trigger('click');
    expect(wrapper.emitted('editAuthor')).toBeDefined();
    expect(wrapper.emitted('editAuthor')?.at(0)).toEqual(['testId1']);
  });

  it('setting the filter filters the expected authors', async () => {
    const wrapper = mount(AuthorTable, {
      props: {
        data: testAuthorData,
      },
    });
    expect(wrapper).toBeDefined();
    const textInput = wrapper.find('input');
    expect(textInput).toBeDefined();
    const tbodyEl = wrapper.find('tbody');
    const rowsBeforeFilter = tbodyEl.findAll('tr');
    expect(rowsBeforeFilter.length).toBeGreaterThan(1);
    await textInput.setValue('testAuthor1');
    const rowsAfterFilter = tbodyEl.findAll('tr');
    for (const row of rowsAfterFilter) {
      expect(row.text()).toContain('testAuthor1');
    }
  });
});
