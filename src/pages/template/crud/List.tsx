// ListTemplates.tsx
import { useSession } from '@hooks/useSession';
import { useQuery } from '@hooks/useQuery'; // useQuery tipado
import Section from '@components/Section';
import { Button, Stack, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PageContainer } from '@toolpad/core';
import { templateDataSources, Template } from '@datasources/template';

interface ListTemplatesProps {
  onRowClick: (id: string | number) => void;
  onCreateClick: () => void;
}

export const ListTemplates = ({
  onRowClick,
  onCreateClick,
}: ListTemplatesProps) => {
  const { session } = useSession();
  const token = session?.user.token;

  // Query para buscar templates
  const {
    data: templates,
    isLoading,
    isError,
    refetch,
  } = useQuery<Template[], Error>(
    'templates',
    async () => {
      if (!token) return [];
      return templateDataSources.getMany(token);
    },
    { enabled: !!token }
  );

  // Monta as linhas da tabela
  const rows =
    templates?.map((t, index) => ({
      id: t.name + index, // se houver id real do backend, substitua
      title: t.name,
    })) ?? [];

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'title', headerName: 'Título', flex: 1 },
  ];

  return (
    <PageContainer>
      <Section title="Templates">
        <Stack gap={2}>
          <Stack direction="row-reverse">
            <Button variant="contained" onClick={onCreateClick}>
              Criar Template
            </Button>
          </Stack>

          {isLoading && (
            <Stack direction="row" alignItems="center" gap={1}>
              <CircularProgress size={24} />
              <Typography>Carregando templates...</Typography>
            </Stack>
          )}

          {isError && (
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography color="error">Erro ao carregar templates</Typography>
              <Button onClick={refetch} variant="outlined">
                Tentar novamente
              </Button>
            </Stack>
          )}

          {!isLoading && !isError && (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { page: 1, pageSize: 10 } },
              }}
              disableRowSelectionOnClick
              onRowClick={(params) => onRowClick(params.id)}
              sx={{
                backgroundColor: '#ffffff',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#ffffff !important',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: 'black',
                },
              }}
            />
          )}
        </Stack>
      </Section>
    </PageContainer>
  );
};
