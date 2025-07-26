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

export const reportDataSource: ReportDataSource = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'nome', headerName: 'Nome' },
    { field: 'situacao', headerName: 'Situação' },
    { field: 'substituto', headerName: 'Substituto', type: 'boolean' },
    { field: 'tem_recibo', headerName: 'Tem Recibo', type: 'boolean' },
    { field: 'tem_assinatura', headerName: 'Tem Assinatura', type: 'boolean' },
    { field: 'observacao', headerName: 'Observação' },
    { field: 'FGTS', headerName: 'FGTS', type: 'boolean' },
    { field: 'INSS', headerName: 'INSS', type: 'boolean' },
    { field: 'VT', headerName: 'VT', type: 'boolean' },
    { field: 'total_horas', headerName: 'Total Horas' },
    { field: 'data_inicio', headerName: 'Data Início', type: 'date' },
    { field: 'data_fim', headerName: 'Data Fim', type: 'date' },
  ],

  getMany: async () => {
    const response = await fetch('/api/reports');
    if (!response.ok) throw new Error('Erro ao listar relatórios');
    const { items, itemCount } = await response.json();
    return { items, itemCount };
  },

  getOne: async (id) => {
    const response = await fetch(`/api/reports/${id}`);
    if (!response.ok) throw new Error('Relatório não encontrado');
    const { data } = await response.json();
    return data as Report;
  },

  createOne: async (files, token) => {
    const formData = new FormData();
    for (const label in files) {
      const file = files[label];
      if (file) formData.append(label, file);
    }

    const response = await fetch('/api/reports/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Erro ao enviar arquivos');

    const { data } = await response.json();
    return data as Report;
  },

  deleteOne: async (id) => {
    const response = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar relatório');
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
