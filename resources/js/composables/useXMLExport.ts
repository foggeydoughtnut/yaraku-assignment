import { useAuthorStore } from '@/stores/AuthorStore';
import { useBookStore } from '@/stores/BookStore';
import { generateXML } from '@/utils/exportUtils';

export const useXMLExport = (columnsToExport: { author: boolean; book: boolean }) => {
  const bookStore = useBookStore();
  const authorStore = useAuthorStore();

  const columns: ('author' | 'book')[] = [];
  if (columnsToExport.book) {
    columns.push('book');
  }
  if (columnsToExport.author) {
    columns.push('author');
  }

  const data: Record<string, string>[] = [];
  if (columnsToExport.book && columnsToExport.author) {
    for (const book of bookStore.books.values()) {
      const rowData: Record<string, string> = {
        title: book.title,
        author: book.authors.at(0)?.name ?? '',
      };
      data.push(rowData);
    }
  } else if (columnsToExport.book && !columnsToExport.author) {
    for (const book of bookStore.books.values()) {
      const rowData: Record<string, string> = {
        title: book.title,
      };
      data.push(rowData);
    }
  } else if (columnsToExport.author && !columnsToExport.book) {
    for (const author of authorStore.authors.values()) {
      const rowData: Record<string, string> = {
        author: author.name,
      };
      data.push(rowData);
    }
  }

  generateXML(data);
};
