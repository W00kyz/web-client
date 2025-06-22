import { useState } from "react";
import { FileUpload } from "@components/FileUpload";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FileUploadProps } from "@customTypes/components";

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
    maxFiles: { control: "number", description: "Número máximo de arquivos" },
    maxFileSize: {
      control: "number",
      description: "Tamanho máximo do arquivo em bytes",
    },
    allowedExtensions: {
      control: { type: "inline-check" },
      options: [".jpg", ".png", ".pdf", ".docx"],
      description: "Selecione extensões permitidas",
    },
    name: { control: "text" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    error: { control: "text" },
    onChange: { action: "onChange" },
  },
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

const Template = (args: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload
      {...args}
      value={files}
      onChange={(newFiles) => {
        setFiles(newFiles);
        if (args.onChange) args.onChange(newFiles);
      }}
    />
  );
};

export const ButtonVariant: Story = {
  render: Template,
  args: {
    variant: "button",
    multiple: false,
    auto: false,
    url: "",
    maxFiles: 3,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedExtensions: [".jpg", ".png", ".pdf"],
    placeholder: "Enviar Arquivo",
    disabled: false,
    required: false,
    error: "",
    name: "fileUpload",
  },
};

export const InputVariant: Story = {
  render: Template,
  args: {
    variant: "input",
    multiple: true,
    auto: false,
    url: "",
    maxFiles: 5,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedExtensions: [".pdf"],
    placeholder: "Escolher Arquivo",
    disabled: false,
    required: false,
    error: "",
    name: "fileUpload",
  },
};

export const DragDropVariant: Story = {
  render: Template,
  args: {
    variant: "dragdrop",
    multiple: true,
    auto: true,
    url: "https://example.com/upload",
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedExtensions: [".jpg", ".png", ".pdf", ".docx"],
    placeholder: "Arraste e solte arquivos aqui ou clique para enviar",
    disabled: false,
    required: false,
    error: "",
    name: "fileUpload",
  },
};
