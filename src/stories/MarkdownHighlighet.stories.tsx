import { MarkdownHighlighter } from '@components/MarkdownHighlighter';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Example/MarkdownHighlighter',
  component: MarkdownHighlighter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    nameFile: { control: 'text' },
    markdownContent: { control: 'text' },
  },
  args: {
    nameFile: 'meu-arquivo.md',
    markdownContent:
      '# Título\n\nEste é um **conteúdo** de exemplo com _Markdown_.',
  },
} satisfies Meta<typeof MarkdownHighlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyMarkdown: Story = {
  args: {
    markdownContent: '',
  },
};

export const LongMarkdown: Story = {
  args: {
    markdownContent: `# Documento Extenso

## Seção 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## Seção 2
- Item 1
- Item 2
- Item 3

## Conclusão
Texto final.`,
  },
};
