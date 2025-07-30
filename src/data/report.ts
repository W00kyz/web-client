import type { DataSource, DataModel } from '@toolpad/core';
import { z } from 'zod';

export interface Report extends DataModel {
  nome: string;
  situacao: string;
  substituto: boolean;
  tem_recibo: boolean;
  tem_assinatura: boolean;
  observacao: string;
  FGTS: boolean;
  INSS: boolean;
  VT: boolean;
  total_horas: string;
  data_inicio: string;
  data_fim: string;
}

export interface ReportDataSource
  extends Omit<DataSource<Report>, 'createOne'> {
  createOne: (
    files: Record<string, File | null>,
    token: string
  ) => Promise<Report>;
}

const reportStore: Report[] = [
  {
    id: '1',
    nome: 'João Silva',
    situacao: 'Ativo',
    substituto: false,
    tem_recibo: true,
    tem_assinatura: true,
    observacao: 'Nenhuma',
    FGTS: true,
    INSS: true,
    VT: false,
    total_horas: '160',
    data_inicio: '2025-07-01',
    data_fim: '2025-07-30',
  },
  {
    id: '2',
    nome: 'Maria Souza',
    situacao: 'Inativo',
    substituto: true,
    tem_recibo: false,
    tem_assinatura: false,
    observacao: 'Aguardando assinatura',
    FGTS: false,
    INSS: true,
    VT: true,
    total_horas: '120',
    data_inicio: '2025-06-01',
    data_fim: '2025-06-30',
  },
];

export const reportDataSource: ReportDataSource = {
  fields: [
    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'nome', headerName: 'Nome', width: 120 },
    { field: 'situacao', headerName: 'Situação', width: 120 },
    {
      field: 'substituto',
      headerName: 'Substituto',
      type: 'boolean',
      width: 120,
    },
    {
      field: 'tem_recibo',
      headerName: 'Recibo',
      type: 'boolean',
      width: 80,
    },
    {
      field: 'tem_assinatura',
      headerName: 'Assinatura',
      type: 'boolean',
      width: 120,
    },
    { field: 'FGTS', headerName: 'FGTS', type: 'boolean', width: 80 },
    { field: 'INSS', headerName: 'INSS', type: 'boolean', width: 80 },
    { field: 'VT', headerName: 'VT', type: 'boolean', width: 80 },
    { field: 'total_horas', headerName: 'Total Horas', width: 120 },
    {
      field: 'data_inicio',
      headerName: 'Data Início',
      type: 'date',
      width: 120,
    },
    { field: 'data_fim', headerName: 'Data Fim', type: 'date', width: 120 },
    { field: 'observacao', headerName: 'Observação', width: 120 },
  ],

  // ✅ Mock getMany
  getMany: async () => {
    return {
      items: reportStore,
      itemCount: reportStore.length,
    };
  },

  // ✅ Mock getOne
  getOne: async (id) => {
    const report = reportStore.find((r) => r.id === id);
    if (!report) throw new Error('Relatório não encontrado');
    return report;
  },

  // ✅ Mock createOne
  createOne: async (files, token) => {
    const newReport: Report = {
      id: String(
        reportStore.length > 0
          ? Math.max(...reportStore.map((r) => Number(r.id))) + 1
          : 1
      ),
      nome: 'Novo Relatório',
      situacao: 'Pendente',
      substituto: false,
      tem_recibo: false,
      tem_assinatura: false,
      observacao: '',
      FGTS: false,
      INSS: false,
      VT: false,
      total_horas: '0',
      data_inicio: new Date().toISOString().split('T')[0],
      data_fim: new Date().toISOString().split('T')[0],
    };
    reportStore.push(newReport);
    return newReport;
  },

  // ✅ Mock deleteOne
  deleteOne: async (id) => {
    const index = reportStore.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Relatório não encontrado');
    reportStore.splice(index, 1);
  },

  validate: z.object({
    nome: z.string().nonempty('Nome é obrigatório'),
    situacao: z.string().nonempty('Situação é obrigatória'),
    substituto: z.boolean(),
    tem_recibo: z.boolean(),
    tem_assinatura: z.boolean(),
    observacao: z.string().optional(),
    FGTS: z.boolean(),
    INSS: z.boolean(),
    VT: z.boolean(),
    total_horas: z.string().nonempty('Total horas é obrigatório'),
    data_inicio: z.string().nonempty('Data início é obrigatória'),
    data_fim: z.string().nonempty('Data fim é obrigatória'),
  })['~validate'],
};
