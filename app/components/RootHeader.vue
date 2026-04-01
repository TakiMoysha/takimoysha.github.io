<script setup lang="ts">
import SiteTitle from './ui/SiteTitle.vue';

const navigationItems = [
  { label: 'Archive', to: '/archive' },
  { label: 'Series', to: '/series', disabled: true },
  { label: 'Projects', to: '/projects', disabled: true },
  { label: 'CV', to: '/cv', disabled: true },
];

const dropdownItems = navigationItems.map((item) => ({
  ...item,
  type: 'link' as const,
}));
</script>

<template>
  <header class="bg-base-100 border-b border-base-300 sticky top-0 z-50">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <SiteTitle />

      <nav class="hidden sm:flex items-center">
        <UNavigationMenu :items="navigationItems" highlight color="neutral" variant="link" />
      </nav>

      <UDropdownMenu :items="dropdownItems" :content="{ align: 'end' }" class="sm:hidden">
        <UButton icon="lucide:menu" color="neutral" variant="ghost" aria-label="Toggle navigation menu" />
      </UDropdownMenu>
    </div>
  </header>
</template>
