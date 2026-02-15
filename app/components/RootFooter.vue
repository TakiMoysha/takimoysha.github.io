<template>
  <footer class="footer sm:footer-horizontal footer-center bg-base-100 text-base-content p-4">
    <aside class="flex place-content-between">
      <p>© {{ currentYear }}, TakiMoysha. Built with Nuxt and Tailwind CSS</p>
      <ToolThemeSwitcher />
    </aside>
  </footer>
</template>

<script setup lang="ts">
import ToolThemeSwitcher from './ToolThemeSwitcher.vue';

const currentYear = new Date().getFullYear();
</script>
