<template>
  <header>
    <a
      id="skip-to-content"
      href="#main-content"
      aria-label="Skip to main content"
      class="absolute inset-s-8 -top-full z-50 px-3 py-2 text-accent transition-all focus:top-4"
    >
      Skip to content
    </a>
    
    <div class="navbar bg-base-100 shadow-sm">
      <div class="navbar-start">
        <div class="shrink-0 flex items-center gap-3">
          <ToolNavigator class="sm:hidden" />
          <NuxtLink to="/" class="text-xl">
            <h1 class="uppercase font-bold bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
              {{ SITE.title }}
            </h1>
          </NuxtLink>
        </div>
      </div>

      <div class="navbar-center">
        <nav class="hidden md:flex gap-6">
          <NuxtLink
            to="/archive"
            :class="{ 'text-accent': isActive('/archive') }"
            class="hover:text-base-accent/70 transition-colors"
          >
            Archive
          </NuxtLink>
          <NuxtLink
            to="/cycles"
            :class="{ 'text-accent': isActive('/cycles') }"
            class="hover:text-base-accent/70 transition-colors"
          >
            Cycles
          </NuxtLink>
          <NuxtLink
            to="/projects"
            :class="{ 'text-accent': isActive('/projects') }"
            class="hover:text-base-accent/70 transition-colors"
          >
            Projects
          </NuxtLink>
        </nav>
      </div>

      <div class="navbar-end">
        <div class="flex items-center gap-4">
          <LinkButton href="/feed.xml" title="RSS Feed">
            <IconRSS class="h-5 w-5" />
            <span class="hidden md:sr-only">RSS feed</span>
          </LinkButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { SITE } from '@/consts';
import ToolNavigator from './ToolNavigator.vue';
import LinkButton from './LinkButton.vue';

// Icon component for RSS
const IconRSS = defineComponent({
  setup() {
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          'stroke-width': '2',
          stroke: 'currentColor',
          class: 'h-5 w-5',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z',
          }),
        ],
      );
  },
});

const route = useRoute();

const isActive = (path: string): boolean => {
  const currentPath = route.path;
  const currentPathArray = currentPath
    .split('/')
    .filter((p: string) => p.trim());
  const pathArray = path.split('/').filter((p: string) => p.trim());

  return currentPath === path || currentPathArray[0] === pathArray[0];
};
</script>
