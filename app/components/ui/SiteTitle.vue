<script setup lang="ts">
const site = useAppConfig().SITE_CONFIG;
</script>

<template>
  <NuxtLink to="/" class="flex items-center ">
    <h3 class="px-2 py-1 rounded-md bg-transparent hover:bg-base-200 transition">
      <span class="font-mono text-base-content/60">TakiMoysha</span>

      <sup class="text-medium pl-0.5 text-base-content/60">\</sup>
      <sub class="text-medium pl-px text-base-content/60">\</sub>

      <span class="font-semibold text-xl brand-style tracking-tight">
        {{ site.title }}
      </span>
    </h3>
  </NuxtLink>
</template>

<style scoped>
@reference "tailwindcss";

.brand-style {
  @apply bg-clip-text uppercase text-transparent bg-linear-to-r from-[#06b6d4] to-[#3b82f6];
}
</style>
