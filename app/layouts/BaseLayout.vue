<template>
  <Html lang="en" dir="ltr" data-theme="dark" />

  <Head>
    <Meta charset="UTF-8" />
    <Meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta name="robots" content="index, follow" />
    <Meta name="description" property="og:description" :content="description || ''" />
    <Link rel="icon" type="image/svg+xml" href="/favicon.png" />
    <RootSeo :title="title" :description="description" :url="url" />
  </Head>

  <div class="body-margin flex min-h-screen flex-col">
    <RootHeader />
    <main id="main-content" class="main-margin relative z-1 flex-1">
      <slot />
    </main>
    <RootFooter />
  </div>
</template>

<script setup lang="ts">
import RootHeader from '@/components/RootHeader.vue';
import RootFooter from '@/components/RootFooter.vue';
import RootSeo from '@/components/RootSeo.vue';

interface Props {
  title: string;
  description: string | undefined;
  url?: string;
}

const props = defineProps<Props>();

const route = useRoute();
const siteUrl = useRuntimeConfig().public.siteUrl;

const url = computed(() => {
  return props.url || `${siteUrl}${route.path}`;
});
</script>
