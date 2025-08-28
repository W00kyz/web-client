import { API_URL } from '@constants/AppContants';

export const fileUploadDataSource = {
  uploadFile: async ({
    file,
    token,
  }: {
    file: File;
    token?: string;
  }): Promise<{ document_md: string }> => {
    // // Mock temporário: simula delay e resposta
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // // Retorno mock
    // return {
    //   document_md: `# Documento mock para arquivo: ${file.name}\n\nConteúdo do arquivo processado mock.`,
    // };

    // Para usar requisição real, descomente o código abaixo e remova o mock:
    try {
      const response1 = await fetch(`${API_URL}/template`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ 
          name: "Extrato",
          pattern_ids: []  // lista vazia se não houver padrões
        }),
      });


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
