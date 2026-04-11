<script setup lang="ts">
interface FileNode {
  name: string;
  comment?: string;
  children?: FileNode[];
}

interface Props {
  nodes?: FileNode[];
  title?: string;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  nodes: () => [],
  compact: false,
});

const emit = defineEmits<{
  copy: [content: string];
}>();

const rawContent = defineModel<string>('raw');

const TREE_CHARS = {
  branch: '│',
  tee: '├',
  last: '└',
  horiz: '──',
  space: ' ',
} as const;

function generateRaw(nodes: FileNode[], prefix = '', isLast = true): string {
  let result = '';

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isNodeLast = i === nodes.length - 1;
    const connector = isNodeLast ? TREE_CHARS.last : TREE_CHARS.tee;
    const currentLine = `${prefix}${connector}${TREE_CHARS.horiz} ${node.name}${node.comment ? `    ${node.comment}` : ''}`;

    result += currentLine + '\n';

    if (node.children && node.children.length > 0) {
      const childPrefix =
        prefix + (isNodeLast ? TREE_CHARS.space : TREE_CHARS.branch) + '   ';
      result += generateRaw(node.children, childPrefix, isNodeLast);
    }
  }

  return result;
}

const rawText = computed(() => {
  if (rawContent.value) return rawContent.value;
  if (props.nodes.length === 0) return '';

  const rootNodes = props.nodes.map((node, i) => ({
    ...node,
    isLast: i === props.nodes.length - 1,
  }));

  let result = '';
  for (const node of rootNodes) {
    const connector = node.isLast ? TREE_CHARS.last : TREE_CHARS.tee;
    const line = `${connector}${TREE_CHARS.horiz} ${node.name}${node.comment ? `    ${node.comment}` : ''}`;
    result += line + '\n';

    if (node.children && node.children.length > 0) {
      const prefix = node.isLast ? '    ' : `${TREE_CHARS.branch}   `;
      result += generateRaw(node.children, prefix, node.isLast);
    }
  }

  return result.trimEnd();
});

const hasContent = computed(() => rawText.value || props.nodes.length > 0);

function copyToClipboard() {
  navigator.clipboard.writeText(rawText.value);
  emit('copy', rawText.value);
}
</script>

<template>
  <div class="not-prose group relative my-6 rounded-lg border border-base-300 bg-base-100">
    <div
      v-if="title || hasContent"
      class="flex items-center justify-between border-b border-base-300 px-4 py-2"
    >
      <span v-if="title" class="font-mono text-sm font-medium text-base-content/70">
        {{ title }}
      </span>
      <span v-else class="font-mono text-sm text-base-content/50">file tree</span>

      <button
        v-if="hasContent"
        type="button"
        class="opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer rounded px-2 py-1 text-xs font-mono text-base-content/50 hover:bg-base-200 hover:text-base-content/70"
        title="Copy tree structure"
        @click="copyToClipboard"
      >
        <span class="i-lucide-copy" />
      </button>
    </div>

    <div v-if="hasContent" class="overflow-x-auto p-4">
      <pre
        v-if="!$slots.default"
        class="font-mono text-sm leading-relaxed"
        :class="{ 'text-xs': compact }"
      ><code>{{ rawText }}</code></pre>

      <slot />
    </div>

    <div v-else class="p-4 text-center font-mono text-sm text-base-content/50">
      <slot />
    </div>
  </div>
</template>
