import type { Meta, StoryObj } from '@nuxtjs/storybook';

import FileTreeView from './FileTreeView.vue';

const meta = {
  title: 'Components/FileTreeView',
  component: FileTreeView,
  tags: ['autodocs'],
} satisfies Meta<typeof FileTreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

const EXAMPLE_DATA = {
    id: "root",
    filename: "uv",
    isDir: true,
    children: [
        { "id": "crates", "filename": "crates", "commit": "исходника на rust", isDir: true },
        { "id": "docs", "filename": "docs", "commit": "MkDocs документация", isDir: true },
        { "id": "python", "filename": "python", "commit": "PyPI wheel, мост для python", isDir: true },
        { "id": "scripts", "filename": "scripts", "commit": ",бенчмарки и тулинг", isDir: true },
        { "id": "test", "filename": "test", "commit": "тесты и необходимые файлы для бенчей", isDir: true },
        { "id": "Cargo.toml", "filename": "Cargo.toml", "commit": "указывает на корень workspace", isDir: true },
        { "id": "pyproject.toml", "filename": "pyproject.toml", "commit": "uv менеджерит сам себя", isDir: true }
    ]
}
export const Default: Story = {
  args: {
    data: EXAMPLE_DATA,
  },
};
