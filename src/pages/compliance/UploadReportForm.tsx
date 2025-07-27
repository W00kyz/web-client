import { useState } from 'react';
import FileInput from '@components/FileInput';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useSession } from '@hooks/useSession';
import { useMutation } from '@hooks/useMutation';
import type { Report, ReportDataSource } from '@datasources/report';

interface UploadReportFormProps {
  onUploadSuccess: (report: Report) => void;
  dataSource: ReportDataSource;
}

const UploadReportForm = ({
  onUploadSuccess,
  dataSource,
}: UploadReportFormProps) => {
  const [files, setFiles] = useState<Record<string, File | null>>({
    funcionarios: null,
    funcionarios_substitutos: null,
    cartao_pontos: null,
    cesta: null,
    vt: null,
  });

  const user = useSession();

  const mutation = useMutation((files: Record<string, File | null>) => {
    if (!user?.session?.user.token) throw new Error('Usuário não autenticado');
    return dataSource.createOne(files, user.session.user.token);
  });

  const handleFileChange = (label: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [label]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(files, {
      onSuccess(report) {
        onUploadSuccess(report);
      },
      onError(error) {
        console.error('Erro ao enviar arquivos:', error);
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box mb={2}>
        <FileInput
          label="Funcionários"
          file={files.funcionarios}
          onChange={(file) => handleFileChange('funcionarios', file)}
          accept="application/pdf"
        />
      </Box>
      <Box mb={2}>
        <FileInput
          label="Funcionários Substitutos"
          file={files.funcionarios_substitutos}
          onChange={(file) =>
            handleFileChange('funcionarios_substitutos', file)
          }
          accept="application/pdf"
        />
      </Box>
      <Box mb={2}>
        <FileInput
          label="Cartão de Pontos"
          file={files.cartao_pontos}
          onChange={(file) => handleFileChange('cartao_pontos', file)}
          accept="application/pdf"
        />
      </Box>
      <Box mb={2}>
        <FileInput
          label="Cesta Básica"
          file={files.cesta}
          onChange={(file) => handleFileChange('cesta', file)}
          accept="application/pdf"
        />
      </Box>
      <Box mb={2}>
        <FileInput
          label="Vale Transporte"
          file={files.vt}
          onChange={(file) => handleFileChange('vt', file)}
          accept="application/pdf"
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Enviando...' : 'Enviar'}
      </Button>
    </Box>
  );
};

export default UploadReportForm;
