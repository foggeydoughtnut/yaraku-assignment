<script setup lang="ts" generic="T">
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { ColumnDef, SortingState } from '@tanstack/vue-table';
import { FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { ref, toRefs } from 'vue';

type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  defaultSorting?: SortingState;
  filterValue?: string;
};

const props = withDefaults(defineProps<TableProps<T>>(), {
  defaultSorting: undefined,
  filterValue: '',
});

const { data, columns, defaultSorting, filterValue } = toRefs(props);
const sorting = ref<SortingState | undefined>(defaultSorting.value);

// Create Table
const table = useVueTable({
  get data() {
    return data.value;
  },
  columns: columns.value,
  getSortedRowModel: getSortedRowModel(),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return filterValue.value;
    },
  },
  onSortingChange: (updaterOrValue) => {
    if (typeof updaterOrValue === 'function') {
      if (sorting.value) {
        sorting.value = updaterOrValue(sorting.value);
      } else {
        sorting.value = updaterOrValue([]);
      }
    } else {
      sorting.value = updaterOrValue;
    }
  },
  enableSorting: true,
  globalFilterFn: 'auto', // built-in filter function
});
</script>

<template>
  <div class="relative size-full overflow-x-auto rounded-box border border-base-content/20 bg-base-100">
    <h1 v-if="data.length === 0 || !data" class="absolute top-1/2 left-1/2 -translate-x-1/2 text-xl">No Data</h1>
    <table class="table-pin-rows table table-zebra">
      <thead>
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" class="border-base-content/20">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :colSpan="header.colSpan"
            :class="[header.column.getCanSort() ? 'cursor-pointer select-none' : '']"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <div v-if="!header.isPlaceholder" class="flex flex-row items-center gap-2">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              <div v-if="header.column.getIsSorted() === 'asc' && !header.isPlaceholder">
                <FontAwesomeIcon :icon="faChevronUp" class="w-[12.5px] font-semibold" />
              </div>
              <div v-else-if="header.column.getIsSorted() === 'desc' && !header.isPlaceholder">
                <FontAwesomeIcon :icon="faChevronDown" class="w-[12.5px] font-semibold" />
              </div>
              <div v-else>
                <div class="ml-2 w-[12.5px]" />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length > 0">
        <tr v-for="row in table.getRowModel().rows" :key="`${row.id}`" class="border-base-content/20">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="columns.length" class="h-[200px]" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
