<script setup lang="ts">
import type { IFileTreeNode } from './FileTreeView.vue';
import FileTreeView from './FileTreeView.vue';

const EXAMPLE_DATA: IFileTreeNode = {
  id: 'root',
  filename: 'uv',
  isDir: true,
  children: [
    { id: 'crates', filename: 'crates', isDir: true },
    { id: 'docs', filename: 'docs', isDir: true },
    { id: 'python', filename: 'python', isDir: true },
    { id: 'scripts', filename: 'scripts', isDir: true },
    { id: 'test', filename: 'test', isDir: true },
    { id: 'cargo-toml', filename: 'Cargo.toml', isDir: false },
    { id: 'pyproject-toml', filename: 'pyproject.toml', isDir: false },
  ],
};
</script>

<template>
  <Story title="Components/FileTreeView">
    <Variant title="Default">
      <FileTreeView :data="EXAMPLE_DATA" />
    </Variant>
  </Story>
</template>
