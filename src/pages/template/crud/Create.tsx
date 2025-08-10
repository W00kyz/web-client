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
  Divider,
} from '@mui/material';
import { PageContainer } from '@toolpad/core';

import { fileUploadDataSource } from '@datasources/upload';
import { useMutation } from '@hooks/useMutation';
import { MarkdownHighlighter } from '@components/MarkdownHighlighter';
import { LabelPanel } from '@components/LabelPanel';

export const CreateTemplate = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadedMd, setUploadedMd] = useState<string>('');

  const { mutate, isLoading, error } = useMutation(
    fileUploadDataSource.uploadFile,
    {
      onSuccess: (data) => {
        setUploadedMd(data.document_md);
      },
      onError: (error) => {
        alert('Erro no upload: ' + error.message);
      },
    }
  );

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadedMd('');
    }
  };

  useEffect(() => {
    if (file) {
      mutate({ file });
    }
  }, [file]);

  return (
    <PageContainer>
      <LabelExampleProvider>
        <Stack spacing={2}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {['Informar dados do Template', 'Definir Labels'].map((label) => (
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
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {isLoading && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={24} />
                  <Typography>Enviando arquivo...</Typography>
                </Stack>
              )}
              <Stack direction="row" spacing={1}>
                <Button
                  disabled={!templateName || !file || isLoading || !uploadedMd}
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
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{ mt: 2 }}
            >
              <MarkdownHighlighter
                nameFile={file?.name ?? ''}
                markdownContent={uploadedMd}
              />
              <Divider orientation="vertical" flexItem />
              <LabelPanel />
            </Stack>
          )}
          {activeStep === 1 && (
            <Stack direction="row" spacing={1} mt={2}>
              <Button onClick={handleBack}>Voltar</Button>
            </Stack>
          )}
        </Stack>
      </LabelExampleProvider>
    </PageContainer>
  );
};
