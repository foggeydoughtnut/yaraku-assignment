import { useAuthorStore } from '@/stores/AuthorStore';
import { useBookStore } from '@/stores/BookStore';
import { generateCSV } from '@/utils/exportUtils';
import { createTestingPinia } from '@pinia/testing';
import { beforeEach, describe } from 'node:test';
import { expect, test, vi } from 'vitest';
import { useCSVExport } from '../useCSVExport';

describe('useExportCSV tests', () => {
  beforeEach(() => {
    const mock = vi.hoisted(() => {
      return {
        generateCSV: vi.fn().mockReturnValue(true),
      };
    });

    vi.mock('@/utils/exportUtils', () => ({
      generateCSV: mock.generateCSV,
    }));
  });

  test('calls generateCSV with both book and author', () => {
    createTestingPinia();
    useCSVExport({ author: true, book: true });
    expect(generateCSV).toHaveBeenCalled();
    expect(generateCSV).toHaveBeenCalledWith(['book', 'author'], []);
  });

  test('calls generateCSV with just book', () => {
    createTestingPinia();
    useCSVExport({ author: false, book: true });
    expect(generateCSV).toHaveBeenCalled();
    expect(generateCSV).toHaveBeenCalledWith(['book'], []);
  });

  test('calls generateCSV with just author', () => {
    createTestingPinia();
    useCSVExport({ author: true, book: false });
    expect(generateCSV).toHaveBeenCalled();
    expect(generateCSV).toHaveBeenCalledWith(['author'], []);
  });

  describe('data sent to generateCSV tests', () => {
    test('book data sent to generateCSV is correct', () => {
      const pinia = createTestingPinia();
      const bookStore = useBookStore(pinia);
      bookStore.books.set('testId1', {
        id: 'testId1',
        title: 'testBook1',
        created_at: '2025-06-13T04:21:57.000000Z',
        updated_at: '2025-06-13T04:21:57.000000Z',
        deleted_at: null,
        authors: [],
      });
      bookStore.books.set('testId2', {
        id: 'testId2',
        title: 'testBook2',
        created_at: '2025-06-13T04:21:57.000000Z',
        updated_at: '2025-06-13T04:21:57.000000Z',
        deleted_at: null,
        authors: [],
      });
      useCSVExport({ author: false, book: true });
      expect(generateCSV).toHaveBeenCalled();
      expect(generateCSV).toHaveBeenCalledWith(['book'], [['testBook1'], ['testBook2']]);
    });

    test('author data sent to generateCSV is correct', () => {
      const pinia = createTestingPinia();
      const authorStore = useAuthorStore(pinia);
      authorStore.authors.set('testId1', {
        id: 'testId1',
        name: 'testAuthor1',
        created_at: '2025-06-13T04:21:57.000000Z',
        updated_at: '2025-06-13T04:21:57.000000Z',
        deleted_at: null,
      });
      authorStore.authors.set('testId2', {
        id: 'testId2',
        name: 'testAuthor2',
        created_at: '2025-06-13T04:22:57.000000Z',
        updated_at: '2025-06-13T04:22:57.000000Z',
        deleted_at: null,
      });

      useCSVExport({ author: true, book: false });
      expect(generateCSV).toHaveBeenCalled();
      expect(generateCSV).toHaveBeenCalledWith(['author'], [['testAuthor1'], ['testAuthor2']]);
    });

    test('author and book data sent to generateCSV is correct', () => {
      const pinia = createTestingPinia();
      const bookStore = useBookStore(pinia);
      bookStore.books.set('testId2', {
        id: 'testId2',
        title: 'testBook2',
        created_at: '2025-06-13T04:21:57.000000Z',
        updated_at: '2025-06-13T04:21:57.000000Z',
        deleted_at: null,
        authors: [
          {
            id: 'testId2',
            name: 'testAuthor2',
            created_at: '2025-06-13T04:22:57.000000Z',
            updated_at: '2025-06-13T04:22:57.000000Z',
            deleted_at: null,
            pivot: {
              created_at: '',
              updated_at: '',
              author_id: 'testId2',
              book_id: 'testId2',
            },
          },
        ],
      });

      useCSVExport({ author: true, book: true });
      expect(generateCSV).toHaveBeenCalled();
      expect(generateCSV).toHaveBeenCalledWith(['book', 'author'], [['testBook2', 'testAuthor2']]);
    });
  });
});
