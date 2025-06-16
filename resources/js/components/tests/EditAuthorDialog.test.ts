import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';
import EditAuthorDialog from '../EditAuthorDialog.vue';

describe('EditAuthorDialog tests', () => {
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
    const wrapper = mount(EditAuthorDialog, {
      props: {
        author: {
          id: '',
          name: '',
          created_at: '',
          updated_at: '',
          deleted_at: null,
        },
        showEditAuthorForm: true,
      },
    });
    expect(wrapper).toBeDefined();
  });
});
