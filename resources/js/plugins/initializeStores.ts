import { useAuthorStore } from '@/stores/AuthorStore';
import { useBookStore } from '@/stores/BookStore';
import { Plugin } from 'vue';

export const initializeStorePlugin = {
  async install() {
    const bookStore = useBookStore();
    const authorStore = useAuthorStore();

    bookStore.initialize();
    authorStore.initialize();
  },
} satisfies Plugin;
