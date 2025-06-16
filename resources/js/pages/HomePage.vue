<script setup lang="ts">
import AddBookDialog from '@/components/AddBookDialog.vue';
import AuthorTable from '@/components/AuthorTable.vue';
import BookTable from '@/components/BookTable.vue';
import EditAuthorDialog from '@/components/EditAuthorDialog.vue';
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
        <h2 class="text-center text-xl font-semibold">Books</h2>
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
</template>
