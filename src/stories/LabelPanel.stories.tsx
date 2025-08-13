import { LabelPanel } from '@components/LabelPanel';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Example/LabelPanel',
  component: LabelPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    templateTitle: { control: 'text' },
    labels: { control: 'object' },
  },
  args: {
    templateTitle: 'Nome Template',
    labels: {
      'Seção Principal': ['Exemplo 1', 'Exemplo 2'],
      'Outro Rótulo': ['Exemplo A', 'Exemplo B', 'Exemplo C'],
    },
  },
} satisfies Meta<typeof LabelPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    labels: {
      'Seção Principal': [],
    },
  },
};

export const MultipleSections: Story = {
  args: {
    labels: {
      'Seção Principal': ['Texto 1'],
      Subseção: ['Dado 1', 'Dado 2'],
      Detalhes: ['Info A'],
    },
  },
};
