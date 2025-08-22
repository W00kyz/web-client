import React, { useState, useEffect } from 'react';
import { LabelExampleProvider } from '@hooks/useLabelExample';
import {
  Stack,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { PageContainer } from '@toolpad/core';

import { fileUploadDataSource } from '@datasources/upload';
import { useMutation } from '@hooks/useMutation';
import { LabelPanel } from '@components/LabelPanel';
import { useSession } from '@hooks/useSession';
import { FileUpload } from '@components/FileUpload';
import { HtmlHighlighter } from '@components/MarkdownHighlighter';

export const CreateTemplate = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadedHtml, setUploadedHtml] = useState<string>(''); // 🔹 trocado
  const [regex, setRegex] = useState<string | null>(null);
  const { session } = useSession();

  const { mutate, isLoading, error } = useMutation(
    fileUploadDataSource.uploadFile,
    {
      onSuccess: (data) => {
        // 🔹 ajusta para o campo que o backend retorna em HTML
        setUploadedHtml(data.document_md);
      },
      onError: (error) => {
        alert('Erro no upload: ' + error.message);
      },
    }
  );

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setUploadedHtml('');
    setRegex(null);
  };

  useEffect(() => {
    if (file) {
      mutate({ file, token: session?.user.token });
    }
  }, [file]);

  return (
    <PageContainer>
      <LabelExampleProvider>
        <Stack spacing={2}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {['Informar dados do Template', 'Definir Rótulos'].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Stack spacing={2}>
              <TextField
                label="Nome do Template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                fullWidth
                disabled={isLoading}
              />
              <FileUpload file={file} onChange={handleFileChange} />
              {isLoading && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={24} />
                  <Typography>Enviando arquivo...</Typography>
                </Stack>
              )}
              <Stack direction="row" spacing={1}>
                <Button
                  disabled={
                    !templateName || !file || isLoading || !uploadedHtml
                  } // 🔹 atualizado
                  variant="contained"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              </Stack>
              {error && (
                <Typography color="error">
                  Erro: {(error as Error).message}
                </Typography>
              )}
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
                sx={{ mt: 2 }}
              >
                <Stack>
                  <HtmlHighlighter
                    nameFile={file?.name ?? ''}
                    htmlContent={uploadedHtml} // 🔹 atualizado
                    highlightRegex={regex}
                  />
                  <Stack
                    direction={'row'}
                    justifyContent={'center'}
                    spacing={2}
                    my={1}
                  >
                    <Button onClick={handleBack} variant="outlined">
                      Voltar
                    </Button>
                    <Button variant="contained">Salvar</Button>
                  </Stack>
                </Stack>
                <LabelPanel
                  templateName={templateName}
                  setTemplateName={setTemplateName}
                  onNewRegex={(newRegex) => setRegex(newRegex)}
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      </LabelExampleProvider>
    </PageContainer>
  );
};
