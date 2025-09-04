import { HtmlHighlighter } from '@components/MarkdownHighlighter';
import { LabelExampleProvider } from '@hooks/useLabelExample';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Example/HtmlHighlighter',
  component: HtmlHighlighter,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <LabelExampleProvider>
        <Story />
      </LabelExampleProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    nameFile: { control: 'text' },
    htmlContent: { control: 'text' },
    highlightRegex: { control: 'text' },
  },
  args: {
    nameFile: 'meu-arquivo.html',
    htmlContent: `<h1>Título</h1><p>Conteúdo de exemplo</p>`,
    highlightRegex: null,
  },
} satisfies Meta<typeof HtmlHighlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
