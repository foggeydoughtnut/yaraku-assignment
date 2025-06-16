import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';
import AddBookDialog from '../AddBookDialog.vue';

describe('AddBookDialog tests', () => {
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

  it('defined on mount', () => {
    const wrapper = mount(AddBookDialog, {
      props: {
        authors: [],
        showAddBookForm: true,
      },
    });
    expect(wrapper).toBeDefined();
  });
});
