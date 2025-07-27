import { useState } from 'react';
import { Report, ReportDataSource } from '@datasources/report';
import Section from '@components/Section';
import {
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useQuery } from '@hooks/useQuery';
import {
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR as ptBRGrid } from '@mui/x-data-grid/locales';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import UploadReportModal from './UploadReportModal';

interface ComplianceCrudPageProps {
  reportDataSource: ReportDataSource;
}

export const ComplianceCrudPage = ({
  reportDataSource,
}: ComplianceCrudPageProps) => {
  const [empresa, setEmpresa] = useState<string>('');
  const [data, setData] = useState<Date | null>(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const paginationModel: GridPaginationModel = { page: 0, pageSize: 100 };
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
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel id="empresa-label">Empresa</InputLabel>
            <Select
              labelId="empresa-label"
              label="Empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            >
              <MenuItem value="empresa1">Empresa 1</MenuItem>
              <MenuItem value="empresa2">Empresa 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={['year', 'month']}
              label="Mês e Ano"
              value={data}
              onChange={(newDate) => setData(newDate)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
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
