<script setup lang="ts">
import { SOCIALS } from '@/constants';
import ToolThemeSwitcher from '@/components/ToolThemeSwitcher.vue';

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-base-300 bg-base-100 py-6">
    <div class="mx-auto px-4">
      <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p class="text-base-content/70 text-sm">
          © {{ currentYear }}, TakiMoysha
        </p>

        <div class="flex items-center gap-4">
          <NuxtLink v-for="social in SOCIALS" :key="social.href" :to="social.href" :title="social.linkTitle"
            target="_blank" class="text-base-content/70 hover:text-base-content transition-colors">
            <UIcon :name="social.icon" class="h-5 w-5" />
          </NuxtLink>

          <NuxtLink to="/rss.xml" title="RSS Feed"
            class="text-base-content/70 hover:text-base-content transition-colors">
            <UIcon name="uil:rss" class="h-5 w-5" />
          </NuxtLink>

          <ToolThemeSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>
