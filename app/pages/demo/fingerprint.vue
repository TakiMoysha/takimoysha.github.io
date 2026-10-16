<script setup lang="ts">
import MyFingerprint from "~/components/draft/MyFingerprint.vue";

definePageMeta({
  layout: {
    name: "blank-layout",
    props: { title: "Fingerprint" },
  },
});
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-10">
    <MyFingerprint />
  </div>
</template>
