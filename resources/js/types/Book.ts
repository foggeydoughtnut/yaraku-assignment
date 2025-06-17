import { Author } from './Author';

interface AuthorWithPivot extends Author {
  pivot: {
    book_id: string;
    author_id: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Book {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  authors: AuthorWithPivot[];
}
