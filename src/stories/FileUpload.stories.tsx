import FileUpload from "@/components/FileUpload/FileUpload";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["button", "input", "dragdrop"],
    },
    multiple: { control: "boolean" },
    auto: { control: "boolean" },
    url: { control: "text" },
    fileMaxSize: {
      control: "number",
      description: "Tamanho máximo do arquivo em bytes",
    },
    allowedExtensions: {
      control: { type: "inline-check" },
      options: [".jpg", ".png", ".pdf", ".docx"],
      description: "Selecione extensões permitidas",
    },
    onError: { action: "error" }, // ação para capturar erros no Storybook
  },
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const ButtonVariant: Story = {
  args: {
    variant: "button",
    multiple: false,
    auto: false,
    url: "",
    fileMaxSize: 2 * 1024 * 1024, // 2MB
    allowedExtensions: [".jpg", ".png", ".pdf"],
  },
};

export const InputVariant: Story = {
  args: {
    variant: "input",
    multiple: false,
    auto: false,
    url: "",
    fileMaxSize: 2 * 1024 * 1024, // 2MB
    allowedExtensions: [".jpg", ".png"],
  },
};

export const DragDropVariant: Story = {
  args: {
    variant: "dragdrop",
    multiple: true,
    auto: true,
    url: "https://example.com/upload",
    fileMaxSize: 5 * 1024 * 1024, // 5MB
    allowedExtensions: [".jpg", ".png", ".pdf", ".docx"],
  },
};
