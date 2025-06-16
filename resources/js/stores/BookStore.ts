import { useAPI } from '@/composables/useAPI';
import { Book } from '@/types';
import { defineStore } from 'pinia';
import { shallowRef, triggerRef } from 'vue';

const api = useAPI();
export const useBookStore = defineStore('book', () => {
  const books = shallowRef<Map<string, Book>>(new Map());
  const initialize = async () => {
    const bookResult = await api.books.getAll();
    for (const book of bookResult) {
      books.value.set(book.id, book);
    }
    triggerRef(books);
  };

  const readBook = async (id: string) => {
    if (id) {
      const bookResult = await api.books.get(id);
      if (bookResult.id) {
        books.value.set(bookResult.id, bookResult);
        triggerRef(books);
      }
    }
  };

  const createBook = async (title: string, authorInfo: { authorId: string } | { authorName: string }) => {
    let newBook: Book | undefined;
    if ('authorId' in authorInfo) {
      newBook = await api.books.create(title, { authorId: authorInfo.authorId });
    } else {
      newBook = await api.books.create(title, { authorName: authorInfo.authorName });
    }
    if (newBook) {
      await readBook(newBook.id);
    }
  };

  const deleteBook = async (id: string) => {
    const result = await api.books.delete(id);
    if (result.status === 'success') books.value.delete(id);
    triggerRef(books);
  };

  return { books, initialize, createBook, deleteBook, readBook };
});
