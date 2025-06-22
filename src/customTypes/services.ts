export type UploadOptions = {
  url: string;
  files: File[];
  onProgress?: (percent: number) => void;
  onComplete?: (response: unknown) => void;
  onError?: (error: string) => void;
};
