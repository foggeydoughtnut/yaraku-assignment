<script setup lang="ts">
import { Book } from '@/types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { createColumnHelper, SortingState } from '@tanstack/vue-table';
import { h, ref } from 'vue';
import DataTable from './DataTable.vue';

defineProps<{
  data: Book[];
}>();
const emit = defineEmits<{
  (e: 'deleteBook', id: string): void;
  (e: 'enableBookForm'): void;
}>();

const filter = ref('');

const columnHelper = createColumnHelper<Book>();

const isDeleteDialogOpen = ref(false);

let bookToDelete = '';

const showConfirmDeleteDialog = (id: string) => {
  isDeleteDialogOpen.value = true;
  bookToDelete = id;
};

const cancelDelete = () => {
  bookToDelete = '';
  isDeleteDialogOpen.value = false;
};

const handleDeleteConfirm = () => {
  isDeleteDialogOpen.value = false;
  const bookId = bookToDelete;
  bookToDelete = '';
  emit('deleteBook', bookId);
};

const columns = [
  // Display Column
  columnHelper.accessor('title', {
    id: 'title',
    cell: (info) => info.getValue(),
    header: 'Title',
  }),
  columnHelper.accessor((row) => row.authors.map((author) => author.name), {
    id: 'author',
    cell: (info) => {
      return info.getValue().join(', ');
    },
    header: 'Author',
  }),
  columnHelper.accessor('id', {
    id: 'id',
    cell: (info) =>
      h('div', { class: 'flex justify-end' }, [
        h(
          'button',
          {
            onClick: () => showConfirmDeleteDialog(info.getValue()),
            class: 'p-2 hover:cursor-pointer hover:text-error transition',
            title: 'Delete Book',
          },
          [h(FontAwesomeIcon, { icon: faTrash })],
        ),
      ]),
    header: '',
  }),
];

const defaultSorting: SortingState = [{ id: 'title', desc: false }];
</script>

<template>
  <div class="flex size-full flex-col gap-4 overflow-hidden">
    <div class="join-horizontal mt-1 ml-1 join flex-0">
      <label class="input join-item w-56">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input v-model="filter" type="search" class="grow" placeholder="Search" />
      </label>
      <button class="btn join-item btn-success" @click="emit('enableBookForm')">Add Book</button>
    </div>
    <DataTable class="flex-1" :data="data" :columns="columns" :default-sorting="defaultSorting" :filter-value="filter" />
  </div>

  <TransitionRoot appear :show="isDeleteDialogOpen" as="template">
    <Dialog as="div" @close="cancelDelete" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 dark:bg-white/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="flex flex-col gap-2">
                <DialogTitle as="h3" class="text-lg leading-6">Are you sure that you want to delete this book?</DialogTitle>
                <p class="text-xs">This action cannot be undone.</p>
              </div>
              <div class="mt-4 flex flex-row justify-end gap-2">
                <button class="btn btn-sm btn-error" @click="cancelDelete">Cancel</button>
                <button class="btn btn-sm btn-success" @click="handleDeleteConfirm">Continue</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
