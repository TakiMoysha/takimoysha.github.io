<script setup lang="ts">
import { SITE } from '@/constants';
</script>

<template>
  <div class="flex shrink-0 items-center gap-3">
    <NuxtLink to="/" class="text-xl">
      <h1 class="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text font-bold uppercase text-transparent">
        {{ SITE.title }}
      </h1>
    </NuxtLink>
  </div>
</template>
