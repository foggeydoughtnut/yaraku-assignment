import { useAPI } from '@/composables/useAPI';
import { Author } from '@/types';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthorStore } from '../AuthorStore';

describe('Author Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const mock = vi.hoisted(() => {
      const testingAuthors: Author[] = [
        {
          id: 'testId1',
          name: 'testAuthor1',
          created_at: '2025-06-13T04:21:57.000000Z',
          updated_at: '2025-06-13T04:21:57.000000Z',
          deleted_at: null,
        },
        {
          id: 'testId2',
          name: 'testAuthor2',
          created_at: '2025-06-13T04:22:57.000000Z',
          updated_at: '2025-06-13T04:22:57.000000Z',
          deleted_at: null,
        },
        {
          id: 'testId3',
          name: 'testAuthor3',
          created_at: '2025-06-13T04:23:57.000000Z',
          updated_at: '2025-06-13T04:23:57.000000Z',
          deleted_at: null,
        },
      ];
      return {
        useAPI: vi.fn().mockReturnValue({
          authors: {
            getAll: vi.fn().mockResolvedValue(testingAuthors),
            get: vi.fn().mockResolvedValue(testingAuthors[0]),
            create: vi.fn().mockResolvedValue(testingAuthors[1]),
            update: vi.fn().mockResolvedValue(testingAuthors[2]),
          },
          books: {
            getAll: vi.fn().mockResolvedValue([]),
          },
        }),
      };
    });

    vi.mock('@/composables/useAPI', () => ({
      useAPI: mock.useAPI,
    }));
  });

  it('initialize gets all authors and updates the state', async () => {
    const authorStore = useAuthorStore();
    expect(authorStore.authors.size).toBe(0);
    await authorStore.initialize();
    expect(useAPI().authors.getAll).toHaveBeenCalled();
    expect(authorStore.authors.size).toBe(3);
  });

  it('readAuthor gets the author with the associated id', async () => {
    const authorStore = useAuthorStore();
    expect(authorStore.authors.size).toBe(0);
    await authorStore.readAuthor('testId1');
    expect(useAPI().authors.get).toHaveBeenCalled();
    expect(useAPI().authors.get).toHaveBeenCalledWith('testId1');
    expect(authorStore.authors.size).toBe(1);
    expect(authorStore.authors.has('testId1'));
  });

  it('createAuthor calls create author route and add result to authors', async () => {
    const authorStore = useAuthorStore();
    expect(authorStore.authors.size).toBe(0);
    await authorStore.createAuthor('testing');
    expect(authorStore.authors.size).toBe(1);
    expect(useAPI().authors.create).toHaveBeenCalled();
    expect(useAPI().authors.create).toHaveBeenCalledWith('testing');
  });

  it('updateAuthor calls update author route and updates authors', async () => {
    const authorStore = useAuthorStore();
    expect(authorStore.authors.size).toBe(0);

    // Add fake data into store
    const author: Author = {
      id: 'testId3',
      name: 'randomName',
      created_at: '2025-06-13T04:23:57.000000Z',
      updated_at: '2025-06-13T04:23:57.000000Z',
      deleted_at: null,
    };
    authorStore.authors.set('testId3', author);
    expect(authorStore.authors.size).toBe(1);
    await authorStore.updateAuthor('testId3', 'newName');
    expect(authorStore.authors.size).toBe(1);
    expect(authorStore.authors.get('testId3')).not.toBe('randomName');
    expect(useAPI().authors.update).toHaveBeenCalled();
    expect(useAPI().authors.update).toHaveBeenCalledWith('testId3', 'newName');
  });
});
