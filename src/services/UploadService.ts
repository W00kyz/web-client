import type { UploadOptions } from "@customTypes/services";
import JSZip from "jszip";

export async function uploadFiles(options: UploadOptions) {
  const { url, files, onProgress, onComplete, onError } = options;

  try {
    const zipBlob = await compressFiles(files);
    const uploadStream = createUploadStream(zipBlob, onProgress);

    const response = await sendRequest(url, uploadStream);

    if (response.ok) {
      const data = await response.json();
      if (onComplete) onComplete(data);
    } else {
      handleError(
        `Erro no upload: ${response.status} ${response.statusText}`,
        onError
      );
    }
  } catch (err) {
    handleError((err as Error).message, onError);
  }
}

async function compressFiles(files: File[]): Promise<Blob> {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.name, file);
  });
  return await zip.generateAsync({ type: "blob" });
}

function createUploadStream(
  blob: Blob,
  onProgress?: (percent: number) => void
): ReadableStream {
  const totalSize = blob.size;
  const stream = blob.stream();
  const reader = stream.getReader();

  let uploaded = 0;

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      uploaded += value.length;
      if (onProgress) {
        const percent = (uploaded / totalSize) * 100;
        onProgress(percent);
      }
      controller.enqueue(value);
    },
  });
}

async function sendRequest(url: string, body: ReadableStream) {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/zip",
    },
    body,
  });
}

function handleError(message: string, onError?: (error: string) => void) {
  if (onError) {
    onError(message);
  } else {
    console.error(message);
  }
}
