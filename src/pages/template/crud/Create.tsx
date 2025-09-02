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

export const CreateTemplate = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadedHtml, setUploadedHtml] = useState<string>('');
  const [labels, setLabels] = useState<Label[]>([]);
  const { session } = useSession();

  const {
    mutate: uploadFile,
    isLoading: isUploading,
    error: uploadError,
  } = useMutation(fileUploadDataSource.uploadFile, {
    onSuccess: (data) => setUploadedHtml(data.document_md),
    onError: (error) => alert('Erro no upload: ' + error.message),
  });

  const { mutate: createTemplate, isLoading: isCreatingTemplate } = useMutation<
    { name: string; pattern_ids: string[] },
    void,
    Error
  >(
    async (data) => templateDataSources.createOne(data, session?.user.token), // 🔹 token separado
    {
      onSuccess: () => alert('Template criado com sucesso!'),
      onError: (err) => alert('Erro ao criar template: ' + err.message),
    }
  );

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setUploadedHtml('');
  };

  useEffect(() => {
    if (file) uploadFile({ file, token: session?.user.token });
  }, [file]);

  const handleCreateTemplate = () => {
    const sentLabels = labels.filter((l) => l.sent && l.pattern_id);
    const pattern_ids = sentLabels.map((l) => l.pattern_id!.toString());

    createTemplate(
      { name: templateName, pattern_ids } // 🔹 apenas os dados do template
    );
  };

  return (
    <PageContainer>
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
              disabled={isUploading}
            />
            <FileUpload file={file} onChange={handleFileChange} />
            {isUploading && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={24} />
                <Typography>Enviando arquivo...</Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={1}>
              <Button
                disabled={
                  !templateName || !file || !uploadedHtml || isUploading
                }
                variant="contained"
                onClick={handleNext}
              >
                Próximo
              </Button>
            </Stack>
            {uploadError && (
              <Typography color="error">
                {(uploadError as Error).message}
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
            <Stack>
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
                  onClick={handleCreateTemplate}
                  disabled={
                    labels.some((l) => !l.sent) ||
                    !templateName ||
                    isCreatingTemplate
                  }
                >
                  {isCreatingTemplate ? 'Salvando...' : 'Salvar'}
                </Button>
              </Stack>
            </Stack>

            <LabelPanel
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
