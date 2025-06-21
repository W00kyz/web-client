export type FileUploadProps = {
  variant?: "button" | "input" | "dragdrop";
  multiple?: boolean;
  url?: string;
  auto?: boolean;
  onUpload?: (files: File[]) => void;
  fileMaxSize?: number; // em bytes
  allowedExtensions?: string[]; // ex: [".jpg", ".png"]
  onError?: (error: string) => void; // callback para erros
};