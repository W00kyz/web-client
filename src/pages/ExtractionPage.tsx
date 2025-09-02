import { useState } from 'react';
import {
  Container,
  Select,
  Stack,
  Typography,
  MenuItem,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { FileUpload } from '@components/FileUpload';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { templateDataSources, Template } from '@datasources/template';
import { API_URL } from '@constants/AppContants';
import { useSession } from '@hooks/useSession';
import imgPdf from '@assets/images/ImgPdf.png';

async function sendExtractionRequest(args: {
  template: string;
  file: File;
  token?: string;
}): Promise<string> {
  const formData = new FormData();
  formData.append('template_id', args.template);
  formData.append('file', args.file);

  const res = await fetch(`${API_URL}/document/process`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.token ?? ''}`,
    },
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
  const { session } = useSession();
  const token = session?.user.token;

  // Busca templates com useQuery
  const {
    data: templates,
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    refetch: refetchTemplates,
  } = useQuery<Template[], Error>(
    ['templates', token],
    async () => {
      if (!token) return [];
      return templateDataSources.getMany(token);
    },
    { enabled: !!token }
  );

  const { mutate, isLoading: isSubmitting } = useMutation(
    sendExtractionRequest,
    {
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
    }
  );

  const handleSubmit = () => {
    if (!selectedTemplate || !selectedFile) return;
    mutate({
      template: selectedTemplate,
      file: selectedFile,
      token: token,
    });
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
        alignItems="center"
        sx={{
          width: '100%',
          maxWidth: 500,
          textAlign: 'center',
          mb: 10,
        }}
      >
        <Box
          sx={{
            width: 263,
            height: 263,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 0.5,
          }}
        >
          <img
            src={imgPdf}
            alt="Upload Pdf Image"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: '#000', fontSize: '1.8rem', mb: 1 }}
        >
          Selecione o documento
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: '#555', maxWidth: 350, mb: 3 }}
        >
          Selecione o documento a ser processado e seu respectivo template.
        </Typography>

        <Box sx={{ width: '100%', mb: 2 }}>
          <FileUpload
            file={selectedFile}
            onChange={setSelectedFile}
            sx={{
              width: '100%',
              height: 49,
              backgroundColor: '#fff',
              borderRadius: 1,
              border: '1px solid #ccc',
            }}
          />
        </Box>

        {isTemplatesLoading && <CircularProgress sx={{ mb: 2 }} />}

        {isTemplatesError && (
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <Typography color="error">Erro ao carregar templates</Typography>
            <Button onClick={refetchTemplates} variant="outlined">
              Tentar novamente
            </Button>
          </Stack>
        )}

        {!isTemplatesLoading && !isTemplatesError && (
          <Select
            fullWidth
            value={selectedTemplate}
            displayEmpty
            onChange={(e) => setSelectedTemplate(e.target.value)}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 1,
              height: 48,
              mb: 5,
            }}
          >
            <MenuItem value="" disabled>
              Selecionar template
            </MenuItem>
            {templates?.map((template) => (
              <MenuItem key={template.name} value={template.name}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
        )}

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedTemplate || !selectedFile || isSubmitting}
          sx={{
            width: '40%',
            height: 60,
            backgroundColor: '#7B57C2',
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: 1,
            boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
            '&:hover': {
              backgroundColor: '#6B47B2',
            },
          }}
        >
          Enviar
        </Button>
      </Stack>
    </Container>
  );
};
