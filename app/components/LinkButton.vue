<template>
  <span v-if="disabled" :id="id" class="group inline-block" :class="klass" :title="title" aria-disabled="true">
    <slot />
  </span>
  <a v-else :id="id" :href="href" class="group inline-block text-base-content hover:text-accent" :class="klass"
    :title="title">
    <slot />
  </a>
</template>

<script setup lang="ts">
interface Props {
  id?: string;
  href: string;
  title?: string;
  class?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  class: '',
});

const klass = computed(() => props.class);
</script>
