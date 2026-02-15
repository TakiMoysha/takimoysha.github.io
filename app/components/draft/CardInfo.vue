<template>
  <div class="card bg-base-200 card-xs shadow-sm hover:shadow-md transition ease-in duration-200 hover:scale-105 shadow-accent">
    <div class="card-body m-2">
      <div class="flex items-center gap-x-3">
        <span class="flex items-start">
          <div class="flex-none w-6 text-accent" v-html="icon"></div>
        </span>
        <h2 class="card-title text-base-content font-semibold">{{ title }}</h2>
      </div>
      <p class="text-base-content text-sm">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: string;
}

defineProps<Props>();
</script>
