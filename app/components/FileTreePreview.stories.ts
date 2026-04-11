import type { Meta, StoryObj } from '@nuxtjs/storybook';

import FileTreePreview from './FileTreePreview.vue';

const meta = {
  title: 'Components/FileTreePreview',
  component: FileTreePreview,
  tags: ['autodocs'],
} satisfies Meta<typeof FileTreePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FileTreePreviewStory: Story = {};
