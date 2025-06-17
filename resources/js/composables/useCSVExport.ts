import { useAuthorStore } from '@/stores/AuthorStore';
import { useBookStore } from '@/stores/BookStore';
import { generateCSV } from '@/utils/exportUtils';

export const useCSVExport = (columnsToExport: { author: boolean; book: boolean }) => {
  const bookStore = useBookStore();
  const authorStore = useAuthorStore();

  const columns: ('author' | 'book')[] = [];
  if (columnsToExport.book) {
    columns.push('book');
  }
  if (columnsToExport.author) {
    columns.push('author');
  }
  const data: string[][] = [];

  if (columnsToExport.book && columnsToExport.author) {
    for (const book of bookStore.books.values()) {
      const rowData: string[] = [];
      rowData.push(book.title);
      rowData.push(book.authors.at(0)?.name ?? '');
      data.push(rowData);
    }
  } else if (columnsToExport.book && !columnsToExport.author) {
    for (const book of bookStore.books.values()) {
      const rowData: string[] = [];
      rowData.push(book.title);
      data.push(rowData);
    }
  } else if (columnsToExport.author && !columnsToExport.book) {
    for (const author of authorStore.authors.values()) {
      const rowData: string[] = [];
      rowData.push(author.name);
      data.push(rowData);
    }
  }
  generateCSV(columns, data);
};
