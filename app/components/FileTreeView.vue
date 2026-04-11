<script setup lang="ts">
// TODO: sortable

export interface IFileTreeNode {
  id: string;
  filename: string;
  isDir: boolean;
  children?: IFileTreeNode[];
}

const props = defineProps<{ data: IFileTreeNode }>();
</script>

<template>
  <div>
    {{ props }}
    <slot></slot>
  </div>
</template>
