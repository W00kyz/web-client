import { useState } from 'react';
import { Report, ReportDataSource } from '@datasources/report';
import Section from '@components/Section';
import { Button, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useQuery } from '@hooks/useQuery';
import {
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR as ptBRGrid } from '@mui/x-data-grid/locales';

import UploadReportModal from './UploadReportModal';

interface ComplianceCrudPageProps {
  reportDataSource: ReportDataSource;
}

export const ComplianceCrudPage = ({
  reportDataSource,
}: ComplianceCrudPageProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const paginationModel: GridPaginationModel = { page: 0, pageSize: 10 };
  const sortModel: GridSortModel = [];
  const filterModel: GridFilterModel = { items: [] };

  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useQuery(
    'report-list',
    async () => {
      if (!reportDataSource.getMany) {
        throw new Error('reportDataSource.getMany não está definido');
      }
      return await reportDataSource.getMany({
        paginationModel,
        sortModel,
        filterModel,
      });
    },
    {
      retry: 3,
      refetchOptions: {
        delay: 2000,
        refetchOnWindowFocus: false,
      },
      onError: () => setOpenSnackbar(true),
    }
  );

  const columns: GridColDef[] = reportDataSource.fields.map((field) => {
    if (field.type === 'date') {
      return {
        field: field.field,
        headerName: field.headerName,
        type: 'date',
        width: field.width ?? 80,
        valueGetter: (value) => {
          return value ? new Date(value) : null;
        },
      };
    }
    return {
      field: field.field,
      headerName: field.headerName,
      type: field.type,
      width: field.width ?? 80,
    };
  });

  const rows = error ? [] : (result?.items ?? []);

  return (
    <>
      <Section title="Funcionários">
        <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)}
            >
              Adicionar Relatório
            </Button>
          </Grid>
        </Grid>
        {isLoading && <CircularProgress />}
        {!isLoading && (
          <DataGrid
            localeText={ptBRGrid.components.MuiDataGrid.defaultProps.localeText}
            label="Funcionários"
            showToolbar
            rows={rows}
            columns={columns}
            getRowId={(row) => (row as Report).id}
            disableRowSelectionOnClick
          />
        )}
      </Section>
      <UploadReportModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        dataSource={reportDataSource}
        onUploadSuccess={() => {
          setOpenModal(false);
          refetch();
        }}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          Não foi possível carregar algumas informações. Por favor, contate os
          administradores do sistema.
        </Alert>
      </Snackbar>
    </>
  );
};
