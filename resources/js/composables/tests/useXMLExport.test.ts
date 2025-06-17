import { useAuthorStore } from '@/stores/AuthorStore';
import { useBookStore } from '@/stores/BookStore';
import { generateXML } from '@/utils/exportUtils';
import { createTestingPinia } from '@pinia/testing';
import { beforeEach, describe } from 'node:test';
import { expect, test, vi } from 'vitest';
import { useXMLExport } from '../useXMLExport';

describe('useExportXML tests', () => {
  beforeEach(() => {
    const mock = vi.hoisted(() => {
      return {
        generateXML: vi.fn().mockReturnValue(true),
      };
    });

    vi.mock('@/utils/exportUtils', () => ({
      generateXML: mock.generateXML,
    }));
  });

  describe('data sent to generateXML tests', () => {
    test('book data sent to generateXML is correct', () => {
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
      useXMLExport({ author: false, book: true });
      expect(generateXML).toHaveBeenCalled();
      expect(generateXML).toHaveBeenCalledWith([{ title: 'testBook1' }, { title: 'testBook2' }]);
    });

    test('author data sent to generateXML is correct', () => {
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

      useXMLExport({ author: true, book: false });
      expect(generateXML).toHaveBeenCalled();
      expect(generateXML).toHaveBeenCalledWith([{ author: 'testAuthor1' }, { author: 'testAuthor2' }]);
    });

    test('author and book data sent to generateXML is correct', () => {
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

      useXMLExport({ author: true, book: true });
      expect(generateXML).toHaveBeenCalled();
      expect(generateXML).toHaveBeenCalledWith([{ title: 'testBook2', author: 'testAuthor2' }]);
    });
  });
});
