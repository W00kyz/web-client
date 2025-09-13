// CreateTemplate.tsx
import { useState, useEffect } from 'react';
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
import { FileUpload } from '@components/FileUpload';
import { HtmlHighlighter } from '@components/MarkdownHighlighter';
import { useMutation } from '@hooks/useMutation';
import { fileUploadDataSource } from '@datasources/upload';
import { templateDataSources } from '@datasources/template';
import { useSession } from '@hooks/useSession';
import { Label, LabelPanel } from '@components/LabelPanel';
import { useNavigate } from 'react-router';

export const CreateTemplate = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [templateId, setTemplateId] = useState<number | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [labels, setLabels] = useState<Label[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [uploadedHtml, setUploadedHtml] = useState<string>('');

  const { session } = useSession();
  const navigate = useNavigate();

  const {
    mutate: uploadFile,
    isLoading: isUploading,
    error: uploadError,
  } = useMutation(fileUploadDataSource.uploadFile, {
    onSuccess: (data) => setUploadedHtml(data.document_md),
    onError: (error) => alert('Erro no upload: ' + error.message),
  });

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setUploadedHtml('');
  };

  useEffect(() => {
    if (file) uploadFile({ file, token: session?.user.token });
  }, [file]);

  const { mutate: createTemplate, isLoading: isCreatingTemplate } = useMutation<
    { name: string; pattern_ids: string[] },
    { id: number },
    Error
  >(async (data) => templateDataSources.createOne(data, session?.user.token), {
    onSuccess: (data) => setTemplateId(data.id),
    onError: (err) => alert('Erro ao criar template: ' + err.message),
  });

  const handleNext = () => {
    if (!templateId) {
      createTemplate({ name: templateName, pattern_ids: [] });
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinish = () => {
    navigate('/templates');
  };

  return (
    <PageContainer>
      <Stack spacing={2}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {['Informar dados do Template', 'Definir Rótulos'].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* ── Etapa 1 ── */}
        {activeStep === 0 && (
          <Stack spacing={2}>
            <TextField
              label="Nome do Template"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              fullWidth
              disabled={isUploading || isCreatingTemplate}
            />
            <FileUpload file={file} onChange={handleFileChange} />
            {isUploading && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={24} />
                <Typography>Enviando arquivo...</Typography>
              </Stack>
            )}
            {uploadError && (
              <Typography color="error">
                {(uploadError as Error).message}
              </Typography>
            )}
            <Stack direction="row" spacing={1}>
              <Button
                disabled={!templateName || isUploading || isCreatingTemplate}
                variant="contained"
                onClick={handleNext}
              >
                Próximo
              </Button>
            </Stack>
          </Stack>
        )}

        {/* ── Etapa 2 ── */}
        {activeStep === 1 && (
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{ mt: 2 }}
          >
            <Stack flex={1}>
              <HtmlHighlighter
                nameFile={file?.name ?? ''}
                htmlContent={uploadedHtml}
              />
              <Stack direction="row" justifyContent="center" spacing={2} my={1}>
                <Button onClick={handleBack} variant="outlined">
                  Voltar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleFinish}
                  disabled={labels.some((l) => !l.sent)}
                >
                  Salvar
                </Button>
              </Stack>
            </Stack>

            <LabelPanel
              templateId={templateId}
              templateName={templateName}
              setTemplateName={setTemplateName}
              onLabelsChange={setLabels}
            />
          </Stack>
        )}
      </Stack>
    </PageContainer>
  );
};
