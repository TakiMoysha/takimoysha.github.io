<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const code = computed<'404' | '500'>(() =>
  props.error?.statusCode === 500 ? '500' : '404',
);
</script>

<template>
  <NuxtLayout name="base-layout">
    <AppError :code="code" />
  </NuxtLayout>
</template>
