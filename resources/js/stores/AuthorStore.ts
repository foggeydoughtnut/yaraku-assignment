import { useAPI } from '@/composables/useAPI';
import { Author } from '@/types';
import { defineStore } from 'pinia';
import { shallowRef, triggerRef } from 'vue';

const api = useAPI();
export const useAuthorStore = defineStore('author', () => {
  const authors = shallowRef<Map<string, Author>>(new Map());
  const initialize = async () => {
    const authorResult = await api.authors.getAll();
    for (const author of authorResult) {
      authors.value.set(author.id, author);
    }
    triggerRef(authors);
  };

  const readAuthor = async (id: string) => {
    if (id) {
      const authorResult = await api.authors.get(id);
      if (authorResult.id) {
        authors.value.set(authorResult.id, authorResult);
        triggerRef(authors);
      }
    }
  };

  const createAuthor = async (authorName: string) => {
    if (authorName) {
      const result = await api.authors.create(authorName);
      authors.value.set(result.id, result);
      triggerRef(authors);
    }
  };

  const updateAuthor = async (id: string, updatedName: string) => {
    if (updatedName && id && authors.value.has(id)) {
      const result = await api.authors.update(id, updatedName);
      authors.value.set(result.id, result);
      triggerRef(authors);
    }
  };

  return { authors, initialize, createAuthor, updateAuthor, readAuthor };
});
