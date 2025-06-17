import { Book } from '@/types';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';
import BookTable from '../BookTable.vue';

const testingBooks: Book[] = [
  {
    id: 'testId1',
    title: 'testBook1',
    created_at: '2025-06-13T04:21:57.000000Z',
    updated_at: '2025-06-13T04:21:57.000000Z',
    deleted_at: null,
    authors: [],
  },
  {
    id: 'testId2',
    title: 'testBook2',
    created_at: '2025-06-13T04:21:57.000000Z',
    updated_at: '2025-06-13T04:21:57.000000Z',
    deleted_at: null,
    authors: [],
  },
  {
    id: 'testId3',
    title: 'testBook3',
    created_at: '2025-06-13T04:21:57.000000Z',
    updated_at: '2025-06-13T04:21:57.000000Z',
    deleted_at: null,
    authors: [],
  },
];

describe('AuthorTable tests', () => {
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {
        // do nothing
      }
      unobserve() {
        // do nothing
      }
      disconnect() {
        // do nothing
      }
    };
  });
  it('has the expected columns present', () => {
    const wrapper = mount(BookTable, {
      props: {
        data: testingBooks,
      },
    });
    expect(wrapper).toBeDefined();
    const header = wrapper.find('thead');
    expect(header).toBeDefined();
    const columnEls = header.findAll('th');
    expect(columnEls.length).toBe(3);
    expect(columnEls.at(0)?.text()).toBe('Title');
    expect(columnEls.at(1)?.text()).toBe('Author');
  });

  it('setting the filter filters the expected books', async () => {
    const wrapper = mount(BookTable, {
      props: {
        data: testingBooks,
      },
    });
    expect(wrapper).toBeDefined();
    const textInput = wrapper.find('input');
    expect(textInput).toBeDefined();
    const tbodyEl = wrapper.find('tbody');
    const rowsBeforeFilter = tbodyEl.findAll('tr');
    expect(rowsBeforeFilter.length).toBeGreaterThan(1);
    await textInput.setValue('testBook1');
    const rowsAfterFilter = tbodyEl.findAll('tr');
    for (const row of rowsAfterFilter) {
      expect(row.text()).toContain('testBook1');
    }
  });

  it('opens delete dialog on delete button click', async () => {
    const wrapper = mount(BookTable, {
      props: {
        data: testingBooks,
      },
    });
    expect(wrapper).toBeDefined();
    const tbodyEl = wrapper.find('tbody');
    const row = tbodyEl.find('tr');
    const columns = row.findAll('td');
    const editButton = columns.at(2)?.find('button');
    expect(wrapper.html()).not.toContain('<!--teleport start-->');
    await editButton?.trigger('click');
    expect(wrapper.html()).toContain('<!--teleport start-->');
  });
});
