<template>
  <ErrorLayout code="404" />
</template>

<script setup lang="ts">
import ErrorLayout from '@/layouts/ErrorLayout.vue';

// Set the response status code for SSR
const event = useRequestEvent();
if (event) {
  setResponseStatus(event, 404);
}
</script>
