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

export const Default: Story = {
  args: {
    nameFile: 'meu-arquivo.pdf',
  },
};

export const EmptyMarkdown: Story = {
  args: {
    markdownContent: '',
    nameFile: 'meu-arquivo.pdf',
  },
};

export const LongMarkdown: Story = {
  args: {
    markdownContent: `# Documento Muito Extenso para Testes

## Introdução

Este é um documento criado para testar a renderização de markdown longo, com diversos elementos típicos, como listas, tabelas, blocos de código e mais.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet facilisis urna. Praesent ultrices eros in cursus turpis massa tincidunt ante in nibh mauris cursus.

## Seção 1 - Texto e Lista

A seguir temos uma lista de itens importantes:

- Primeiro item da lista, explicando algo relevante.
- Segundo item com mais detalhes e subitens:
  - Subitem A
  - Subitem B
  - Subitem C
- Terceiro item que encerra esta seção.

## Seção 2 - Código

Veja o exemplo de código em JavaScript:

\`\`\`javascript
function soma(a, b) {
  return a + b;
}

console.log(soma(5, 3)); // Saída: 8
\`\`\`

Além disso, um trecho em Python:

\`\`\`python
def fatorial(n):
    if n == 0:
        return 1
    return n * fatorial(n-1)

print(fatorial(5))  # Saída: 120
\`\`\`

## Seção 3 - Tabela de Dados

| Produto        | Preço (R$) | Quantidade | Disponível |
|----------------|------------|------------|------------|
| Notebook       | 3500,00    | 12         | Sim        |
| Smartphone     | 2200,00    | 30         | Sim        |
| Teclado        | 150,00     | 50         | Não        |
| Monitor 24"    | 900,00     | 15         | Sim        |

## Seção 4 - Citações e Destaques

> Esta é uma citação importante, que deve ser destacada no documento.
>
> — Autor Desconhecido

Aqui está um texto com **negrito**, *itálico*, ~~riscado~~, e \`código inline\`.

## Seção 5 - Lista Numerada

1. Primeiro passo do processo
2. Segundo passo detalhado
3. Terceiro passo concluindo a lista

## Seção 6 - Parágrafo Final

Por fim, um parágrafo final que termina o documento, reforçando o propósito de testes extensos e garantindo que o componente lide bem com grande volume de conteúdo.

---

**Fim do documento extenso de teste.**`,
    nameFile: 'meu-arquivo.md',
  },
};
