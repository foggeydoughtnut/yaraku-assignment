<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ref } from 'vue';

defineProps<{
  showExportDataForm: boolean;
}>();

const exportTypeOptions: { displayValue: string; value: string }[] = [
  {
    displayValue: 'CSV',
    value: 'csv',
  },
  {
    displayValue: 'XML',
    value: 'xml',
  },
];

const emit = defineEmits<{
  (
    e: 'submitExport',
    exportType: 'csv' | 'xml',
    columnsToExport: {
      author: boolean;
      book: boolean;
    },
  ): void;
  (e: 'cancel'): void;
}>();

const columnsToExport = ref({
  author: true,
  book: true,
});

const exportType = ref<'csv' | 'xml'>('csv');

const handleSubmit = (event: Event) => {
  event.preventDefault();
  if (Object.values(columnsToExport.value).includes(true) && exportType.value) {
    emit('submitExport', exportType.value, columnsToExport.value);
  }
};
</script>

<template>
  <TransitionRoot appear as="template" :show="showExportDataForm">
    <Dialog as="div" @close="emit('cancel')" class="relative z-10">
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
              <DialogTitle as="h3" class="text-lg leading-6">Export data in CSV or XML format</DialogTitle>
              <div class="divider" />
              <form @submit="handleSubmit" class="flex flex-col gap-4">
                <fieldset class="fieldset rounded-box border border-base-content/20 p-4">
                  <legend class="fieldset-legend">Data to export (required)</legend>
                  <label class="label w-fit">
                    <input v-model="columnsToExport.book" type="checkbox" :checked="columnsToExport.book" class="checkbox" />
                    Books
                  </label>
                  <label class="label w-fit">
                    <input v-model="columnsToExport.author" type="checkbox" :checked="columnsToExport.author" class="checkbox" />
                    Authors
                  </label>
                </fieldset>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend">Pick an export type</legend>
                  <select class="validator input select w-full" required v-model="exportType">
                    <option disabled selected>Pick an export type</option>
                    <option v-for="type in exportTypeOptions" :key="type.value" :value="type.value">{{ type.displayValue }}</option>
                  </select>
                  <p class="validator-hint">Required</p>
                </fieldset>
                <div class="mt-4 flex flex-row justify-end gap-2">
                  <input type="button" class="btn btn-sm btn-error" @click="emit('cancel')" value="Cancel" />
                  <input type="submit" class="btn btn-sm btn-success" value="Download" />
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
