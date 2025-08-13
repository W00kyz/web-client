import { Report } from 'datasources/report';

export const mockReport: Report[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  nome: `Funcionário ${i + 1}`,
  situacao: i % 3 === 0 ? 'Ativo' : i % 3 === 1 ? 'Licença' : 'Afastado',
  substituto: i % 5 === 0,
  tem_recibo: i % 2 === 0,
  tem_assinatura: i % 4 !== 0,
  FGTS: true,
  INSS: true,
  VT: i % 6 !== 0,
  observacao: i % 7 === 0 ? 'Pendência na assinatura' : '',
  total_horas: `${160 - (i % 20)}h`,
  data_inicio: `2024-07-${String((i % 28) + 1).padStart(2, '0')}`,
  data_fim: `2024-08-${String((i % 28) + 1).padStart(2, '0')}`,
}));
