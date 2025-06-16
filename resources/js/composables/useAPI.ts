import { Author, Book } from '@/types';

export const useAPI = () => {
  const URL = 'http://localhost';
  return {
    authors: {
      /**
       * @param limit [limit=1000] Max number of authors you would like to return
       * @returns List of Authors
       */
      getAll: async (limit = 1000): Promise<Author[]> => {
        const params = new URLSearchParams();
        params.append('limit', `${limit}`);
        const response = await fetch(`${URL}/api/authors?${params}`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
      /**
       * @param id The id of the author you would like to get
       * @returns The author associated with the id
       */
      get: async (id: string): Promise<Author> => {
        const response = await fetch(`${URL}/api/authors/${id}`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
      /**
       *
       * @param name The name of the author
       * @returns The new author that was created
       */
      create: async (name: string): Promise<Author> => {
        const response = await fetch(`${URL}/api/authors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name }),
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
      /**
       *
       * @param id The id of the author to update
       * @param name The new name for the author
       * @returns The new author
       */
      update: async (id: string, name: string): Promise<Author> => {
        const response = await fetch(`${URL}/api/authors/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name }),
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
    },
    books: {
      /**
       * @param limit [limit=1000] Max number of books you would like to return
       * @returns List of Books
       */
      getAll: async (limit = 1000): Promise<Book[]> => {
        const params = new URLSearchParams();
        params.append('limit', `${limit}`);
        const response = await fetch(`${URL}/api/books?${params}`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
      /**
       *
       * @param title The title of the new book
       * @param authorInfo Uses either the authorId passed in, or it will create a new author with a name of the passed in value for authorName
       * @returns The new book
       */
      create: async (title: string, authorInfo: { authorId: string } | { authorName: string }): Promise<Book> => {
        const dynamicBody =
          'authorId' in authorInfo
            ? {
                authorId: authorInfo.authorId,
              }
            : {
                authorName: authorInfo.authorName,
              };

        const body = {
          title: title,
          ...dynamicBody,
        };
        const response = await fetch(`${URL}/api/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
      /**
       * @param id The book to delete
       * @returns Success message on success
       */
      delete: async (
        id: string,
      ): Promise<{
        message: string;
        status: 'success' | 'warning' | 'error';
      }> => {
        const response = await fetch(`${URL}/api/books/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
    },
  };
};
