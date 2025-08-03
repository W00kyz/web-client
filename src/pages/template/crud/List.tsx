import Section from '@components/Section';
import { Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PageContainer } from '@toolpad/core';

interface ListTemplatesProps {
  onRowClick: (id: string | number) => void;
  onCreateClick: () => void;
  onEditClick: (id: string | number) => void;
}

export const ListTemplates = ({
  onRowClick,
  onCreateClick,
}: ListTemplatesProps) => {
  const rows = [
    { id: '1', title: 'Template 1' },
    { id: '2', title: 'Template 2' },
  ];

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
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { page: 1, pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            onRowClick={(params) => onRowClick(params.id)}
          />
        </Stack>
      </Section>
    </PageContainer>
  );
};
