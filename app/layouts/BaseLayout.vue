<script setup lang="ts">
import RootHeader from '@/components/RootHeader.vue';
import RootFooter from '@/components/RootFooter.vue';
import useSeo from '@/composables/useSeo';

useSeo();
</script>

<template>

  <Head>
    <Meta charset="UTF-8" />
    <Meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta name="robots" content="index, follow" />
    <Link rel="icon" type="image/svg+xml" href="/favicon.png" />

    <!-- vivladi test colors -->
    <Meta name="theme-color" content="#44624a" media="(prefers-color-scheme:dark)" />
  </Head>

  <div class="body-margin flex min-h-screen flex-col">
    <RootHeader>
      <template #header><slot name="header" /></template>
    </RootHeader>
    <main id="main-content" class="main-margin relative z-1 flex-1 pattern-swamp">
      <slot />
    </main>
    <RootFooter />
  </div>
</template>
