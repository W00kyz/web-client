import { API_URL } from '@constants/AppContants';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const fileUploadDataSource = {
  uploadFile: async ({
    file,
    token,
  }: {
    file: File;
    token?: string;
  }): Promise<{ document_md: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/document/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro no upload do arquivo: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro no uploadFile:', error);
      throw error;
    }
  },
};
