<script setup lang="ts">
import AddBookDialog from '@/components/AddBookDialog.vue';
import AuthorTable from '@/components/AuthorTable.vue';
import BookTable from '@/components/BookTable.vue';
import EditAuthorDialog from '@/components/EditAuthorDialog.vue';
import ExportDataDialog from '@/components/ExportDataDialog.vue';
import { useCSVExport } from '@/composables/useCSVExport';
import { useXMLExport } from '@/composables/useXMLExport';
import { useAuthorStore } from '@/stores/AuthorStore';
import { useBookStore } from '@/stores/BookStore';
import { Author } from '@/types';
import { ref } from 'vue';

const bookStore = useBookStore();
const authorStore = useAuthorStore();

const handleBookDelete = async (id: string) => {
  await bookStore.deleteBook(id);
};

const activeAuthor = ref<Author | undefined>(undefined);
const handleEditAuthorCallback = (authorId: string) => {
  activeAuthor.value = authorStore.authors.get(authorId);
};

const handleAuthorEdit = async (id: string, updatedName: string) => {
  await authorStore.updateAuthor(id, updatedName);
  activeAuthor.value = undefined;
};

const showAddBookForm = ref(false);
const enableBookForm = () => {
  showAddBookForm.value = true;
};

const showExportDialog = ref(false);
const handleExport = (
  exportType: 'csv' | 'xml',
  columnsToExport: {
    author: boolean;
    book: boolean;
  },
) => {
  if (exportType === 'csv') {
    useCSVExport(columnsToExport);
  } else {
    useXMLExport(columnsToExport);
  }

  showExportDialog.value = false;
};

const handleAddBook = async (title: string, authorInfo: Author | string) => {
  if (title) {
    if (typeof authorInfo === 'string') {
      if (authorInfo) {
        showAddBookForm.value = false;
        await bookStore.createBook(title, { authorName: authorInfo });
        await authorStore.initialize(); // TODO: switch this to the authorStore.read once we are getting the book with author ids back
      }
    } else {
      const authorId = authorInfo.id;
      if (authorId) {
        showAddBookForm.value = false;
        await bookStore.createBook(title, { authorId: authorId });
      }
    }
  }
};
</script>

<template>
  <div class="flex justify-center overflow-auto p-4 lg:p-8">
    <div class="flex w-4/5 flex-col justify-center gap-8 lg:w-2/3">
      <div class="flex flex-col gap-4 overflow-hidden">
        <div class="relative w-full">
          <h2 class="text-center text-xl font-semibold">Books</h2>
          <button class="btn absolute top-0 right-0 btn-success" @click="showExportDialog = true">Export Data</button>
        </div>
        <div class="max-h-[500px]">
          <BookTable :data="bookStore.books.values().toArray()" @delete-book="handleBookDelete" @enable-book-form="enableBookForm" />
        </div>
      </div>
      <div class="divider" />
      <div class="flex flex-col gap-4 overflow-hidden">
        <h2 class="text-center text-xl font-semibold">Authors</h2>
        <div class="max-h-[500px]">
          <AuthorTable :data="authorStore.authors.values().toArray()" @edit-author="handleEditAuthorCallback" />
        </div>
      </div>
    </div>
  </div>
  <EditAuthorDialog
    v-if="activeAuthor"
    :show-edit-author-form="activeAuthor !== undefined"
    :author="activeAuthor"
    @update-author="handleAuthorEdit"
    @cancel="activeAuthor = undefined"
  />
  <AddBookDialog
    v-if="showAddBookForm"
    :show-add-book-form="showAddBookForm"
    :authors="authorStore.authors.values().toArray()"
    @create-book="handleAddBook"
    @cancel="showAddBookForm = false"
  />
  <ExportDataDialog
    v-if="showExportDialog"
    :show-export-data-form="showExportDialog"
    @cancel="showExportDialog = false"
    @submit-export="handleExport"
  />
</template>
