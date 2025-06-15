<script setup lang="ts">
import { useAuthorStore } from '@/stores/AuthorStore';

const authorStore = useAuthorStore();
</script>

<template>
  <div>
    <h1 class="text-center text-3xl font-bold underline">Home Page</h1>
    <button class="btn" @click="authorStore.increment">Default</button>
    <p>{{ authorStore.count }}</p>
  </div>
</template>
