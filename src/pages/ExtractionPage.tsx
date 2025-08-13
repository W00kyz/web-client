import { useState } from 'react';
import {
  Container,
  Select,
  Stack,
  Typography,
  MenuItem,
  Button,
} from '@mui/material';
import { FileUpload } from '@components/FileUpload';
import { useMutation } from '@hooks/useMutation';
import { API_URL } from '@constants/AppContants';
import { MarkdownModal } from '@components/MarkdownModal';

interface ExtractionResponse {
  message: string;
}

async function sendExtractionRequest(args: {
  template: string;
  file: File;
}): Promise<string> {
  const formData = new FormData();
  formData.append('template', args.template);
  formData.append('file', args.file);

  const res = await fetch(`${API_URL}/extraction`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Falha ao enviar requisição');
  }

  return res.text();
}

export const ExtractionPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate, isLoading } = useMutation(sendExtractionRequest, {
    onSuccess: (csv) => {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resultado.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
  });

  const handleSubmit = () => {
    if (!selectedTemplate || !selectedFile) return;
    mutate({ template: selectedTemplate, file: selectedFile });
  };

  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ width: '100%', maxWidth: 400 }}
      >
        <div
          style={{
            width: 300,
            height: 200, // altura fixa que vai cortar o excesso
            overflow: 'hidden',
            borderRadius: 6, // opcional, bordas arredondadas
          }}
        >
          <img
            src="src/assets/images/ImgPdf.png"
            alt="Upload Pdf Image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // crop automático
              objectPosition: 'center center', // centraliza o foco do crop
            }}
          />
        </div>
        <Typography variant="h3" textAlign="center">
          Selecione o Documento
        </Typography>
        <Typography variant="subtitle1" textAlign="center">
          Selecione o documento e o template
        </Typography>

        <Select
          fullWidth
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <MenuItem value="template1">Template 1</MenuItem>
          <MenuItem value="template2">Template 2</MenuItem>
        </Select>

        <FileUpload file={selectedFile} onChange={setSelectedFile} />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedTemplate || !selectedFile}
          loading={isLoading}
        >
          Enviar
        </Button>
      </Stack>
    </Container>
  );
};
