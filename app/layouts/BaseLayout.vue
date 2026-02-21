<script setup lang="ts">
import RootSeo from '@/components/RootSeo.vue';
import RootHeader from '@/components/RootHeader.vue';
import RootFooter from '@/components/RootFooter.vue';

interface Props {
  title: string;
  description: string | undefined;
}

const props = defineProps<Props>();
</script>

<template>
  <Html lang="en" dir="ltr" />

  <Head>
    <Meta charset="UTF-8" />
    <Meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta name="robots" content="index, follow" />
    <Link rel="icon" type="image/svg+xml" href="/favicon.png" />
    <RootSeo :title="title" :description="description" />
  </Head>

  <div class="body-margin flex min-h-screen flex-col">
    <RootHeader />
    <main id="main-content" class="main-margin relative z-1 flex-1">
      <slot />
    </main>
    <RootFooter />
  </div>
</template>
