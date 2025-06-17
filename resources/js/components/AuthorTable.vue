<script setup lang="ts">
import { Author } from '@/types';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createColumnHelper, SortingState } from '@tanstack/vue-table';
import { h, ref } from 'vue';
import DataTable from './DataTable.vue';

defineProps<{
  data: Author[];
}>();

const emit = defineEmits<{
  (e: 'editAuthor', id: string): void;
}>();

const filter = ref('');

const columnHelper = createColumnHelper<Author>();

const handleEditClick = (id: string) => {
  emit('editAuthor', id);
};

const columns = [
  // Display Column
  columnHelper.accessor('name', {
    id: 'name',
    cell: (info) => info.getValue(),
    header: 'Author',
  }),
  columnHelper.accessor('id', {
    id: 'id',
    cell: (info) =>
      h('div', { class: 'flex justify-end' }, [
        h('button', { onClick: () => handleEditClick(info.getValue()), class: 'p-2 hover:cursor-pointer', title: 'Edit Author' }, [
          h(FontAwesomeIcon, { icon: faEdit }),
        ]),
      ]),
    header: '',
  }),
];

const defaultSorting: SortingState = [{ id: 'name', desc: false }];
</script>

<template>
  <div class="flex size-full flex-col gap-4 overflow-hidden">
    <div class="mt-1 ml-1 flex-0">
      <label class="input w-56">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input v-model="filter" type="search" class="grow" placeholder="Search" />
      </label>
    </div>
    <DataTable class="flex-1" :data="data" :columns="columns" :default-sorting="defaultSorting" :filter-value="filter" />
  </div>
</template>
