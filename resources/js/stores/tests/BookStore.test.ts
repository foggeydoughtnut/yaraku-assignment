import { useAPI } from '@/composables/useAPI';
import { Book } from '@/types';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBookStore } from '../BookStore';

describe('Book Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const mock = vi.hoisted(() => {
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
      return {
        useAPI: vi.fn().mockReturnValue({
          books: {
            getAll: vi.fn().mockResolvedValue(testingBooks),
            get: vi.fn().mockResolvedValue(testingBooks[0]),
            create: vi.fn().mockResolvedValue(testingBooks[1]),
            delete: vi.fn().mockResolvedValue({ message: 'test', status: 'success' }),
          },
        }),
      };
    });

    vi.mock('@/composables/useAPI', () => ({
      useAPI: mock.useAPI,
    }));
  });

  it('initialize gets all books and updates the state', async () => {
    const bookStore = useBookStore();
    expect(bookStore.books.size).toBe(0);
    await bookStore.initialize();
    expect(useAPI().books.getAll).toHaveBeenCalled();
    expect(bookStore.books.size).toBe(3);
  });

  it('readBook gets the book with the associated id', async () => {
    const bookStore = useBookStore();
    expect(bookStore.books.size).toBe(0);
    await bookStore.readBook('testId1');
    expect(useAPI().books.get).toHaveBeenCalled();
    expect(useAPI().books.get).toHaveBeenCalledWith('testId1');
    expect(bookStore.books.size).toBe(1);
    expect(bookStore.books.has('testId1'));
  });

  describe('createBook', () => {
    it('createBook calls create book route with authorName', async () => {
      const bookStore = useBookStore();
      expect(bookStore.books.size).toBe(0);
      await bookStore.createBook('testing', { authorName: 'testing' });
      expect(bookStore.books.size).toBe(1);
      expect(useAPI().books.create).toHaveBeenCalled();
      expect(useAPI().books.create).toHaveBeenCalledWith('testing', { authorName: 'testing' });
    });

    it('createBook calls create book route with authorId', async () => {
      const bookStore = useBookStore();
      expect(bookStore.books.size).toBe(0);
      await bookStore.createBook('testing', { authorId: 'testing' });
      expect(bookStore.books.size).toBe(1);
      expect(useAPI().books.create).toHaveBeenCalled();
      expect(useAPI().books.create).toHaveBeenCalledWith('testing', { authorId: 'testing' });
    });
  });

  describe('deleteBook', () => {
    it('deletes the book when api returns success', async () => {
      const bookStore = useBookStore();
      const testBook: Book = {
        id: 'testId1',
        title: 'testBook1',
        created_at: '2025-06-13T04:21:57.000000Z',
        updated_at: '2025-06-13T04:21:57.000000Z',
        deleted_at: null,
        authors: [],
      };
      bookStore.books.set(testBook.id, testBook);
      expect(bookStore.books.has(testBook.id)).toBeTruthy();
      await bookStore.deleteBook(testBook.id);
      expect(bookStore.books.has(testBook.id)).toBeFalsy();
    });

    it('doesnt delete the book when api a status other than success', async () => {
      const bookStore = useBookStore();
      const testBook: Book = {
        id: 'testId1',
        title: 'testBook1',
        created_at: '2025-06-13T04:21:57.000000Z',
        updated_at: '2025-06-13T04:21:57.000000Z',
        deleted_at: null,
        authors: [],
      };
      bookStore.books.set(testBook.id, testBook);
      expect(bookStore.books.has(testBook.id)).toBeTruthy();
      useAPI().books.delete = vi.fn().mockResolvedValueOnce({ message: 'testing', status: 'error' });
      await bookStore.deleteBook(testBook.id);
      expect(bookStore.books.has(testBook.id)).toBeTruthy();
    });
  });
});
