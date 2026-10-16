<script setup lang="ts">
interface Props {
  src: string;
  alt: string;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: undefined,
});
</script>

<template>
  <img :src="src" :alt="alt" :title="title" width="88" height="31" loading="lazy" decoding="async"
    class="h-[31px] w-[88px] shrink-0 [image-rendering:pixelated]" />
</template>
