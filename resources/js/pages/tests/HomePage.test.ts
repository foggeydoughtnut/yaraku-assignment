// @vitest-environment jsdom

import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';
import HomePage from '../HomePage.vue';

test('Can mount home page', () => {
  const wrapper = mount(HomePage, {
    global: {
      plugins: [createTestingPinia()],
    },
  });
  expect(wrapper).toBeDefined();
});
