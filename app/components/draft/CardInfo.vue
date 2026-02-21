<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="card card-xs bg-base-200 shadow-sm hover:shadow-md transition ease-in duration-200 hover:scale-105 shadow-accent">
    <div class="m-2">
      <div class="card-body flex items-center gap-x-3">
        <span class="flex items-start">
          <div class="flex-none w-6 text-accent" v-html="icon"></div>
        </span>
        <h2 class="card-title text-base-content font-semibold">{{ title }}</h2>
      </div>
      <p class="text-base-content text-sm">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 0.5rem;
  overflow: hidden;
}

.card-body {
  padding: 0.5rem;
}

.card-xs {
  min-height: 80px;
}
</style>
