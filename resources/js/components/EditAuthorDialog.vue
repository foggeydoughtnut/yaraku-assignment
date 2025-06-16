<script setup lang="ts">
import { Author } from '@/types';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ref, toRefs } from 'vue';

const props = defineProps<{
  author: Author;
  showEditAuthorForm: boolean;
}>();

const { author } = toRefs(props);

const emit = defineEmits<{
  (e: 'updateAuthor', id: string, updatedName: string): void;
  (e: 'cancel'): void;
}>();

const newName = ref(author.value.name);

const handleSave = (event: Event) => {
  event.preventDefault();
  if (newName.value) {
    emit('updateAuthor', author.value.id, newName.value);
  }
};
</script>

<template>
  <TransitionRoot appear as="template" :show="showEditAuthorForm">
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
              <DialogTitle as="h3" class="text-lg leading-6">Update Author</DialogTitle>
              <div class="divider" />
              <form @submit="handleSave">
                <fieldset class="fieldset">
                  <legend class="fieldset-legend">Author Name</legend>
                  <input type="text" class="validator input" v-model="newName" required placeholder="New Author" title="Author Name" />
                  <p class="validator-hint">Required</p>
                </fieldset>
                <div class="mt-4 flex flex-row justify-end gap-2">
                  <input type="button" class="btn btn-sm btn-error" @click="emit('cancel')" value="Cancel" />
                  <input type="submit" class="btn btn-sm btn-success" value="Save" />
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
