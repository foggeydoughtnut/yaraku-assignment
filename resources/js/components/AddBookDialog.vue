<script setup lang="ts">
import { Author } from '@/types';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ref, toRefs } from 'vue';

const props = defineProps<{
  authors: Author[];
  showAddBookForm: boolean;
}>();

const { authors } = toRefs(props);

const emit = defineEmits<{
  (e: 'createBook', title: string, authorInfo: Author | string): void;
  (e: 'cancel'): void;
}>();

const title = ref('');
const selectedAuthor = ref<Author | undefined>();
const authorInput = ref('');

const handleSave = (event: Event) => {
  event.preventDefault();
  if (title.value && selectedAuthor.value) {
    emit('createBook', title.value, selectedAuthor.value);
  } else if (title.value && authorInput.value) {
    emit('createBook', title.value, authorInput.value);
  } else {
    console.log('Need author');
  }
};
</script>

<template>
  <TransitionRoot :show="showAddBookForm" appear as="template">
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
              <DialogTitle as="h3" class="text-lg leading-6">Add Book</DialogTitle>
              <div class="divider" />
              <form @submit="handleSave">
                <fieldset class="fieldset">
                  <legend class="fieldset-legend">Book Name</legend>
                  <input type="text" class="validator input" v-model="title" required placeholder="Title" title="Title" />
                  <p class="validator-hint">Required</p>
                </fieldset>

                <fieldset class="fieldset">
                  <legend class="fieldset-legend">Create new author</legend>
                  <input
                    type="text"
                    :disabled="selectedAuthor !== undefined"
                    class="validator input"
                    v-model="authorInput"
                    placeholder="New Author"
                    title="New Author Name"
                  />
                </fieldset>
                <div class="divider mt-4 mb-2">OR</div>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend">Pick an existing author</legend>
                  <select :disabled="authorInput !== ''" class="select" v-model="selectedAuthor">
                    <option disabled selected>Pick an Author</option>
                    <option v-for="author in authors" :key="author.id" :value="author">{{ author.name }}</option>
                  </select>
                </fieldset>

                <div class="mt-4 flex flex-row justify-end gap-2">
                  <input type="button" class="btn btn-sm btn-error" @click="emit('cancel')" value="Cancel" />
                  <input type="submit" class="btn btn-sm btn-success" value="Add Book" />
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
