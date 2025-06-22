export type FileUploadProps = {
  variant?: "button" | "input" | "dragdrop";
  multiple?: boolean;
  url?: string;
  auto?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // em bytes
  allowedExtensions?: string[]; // ex: [".jpg", ".png"]
  value?: File[];
  onChange?: (files: File[]) => void;
  name?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  error?: React.ReactNode;
  icon?: React.ReactNode; // novo ícone opcional para input
};
