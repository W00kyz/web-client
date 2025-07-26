import { Report } from '@datasources/report';
import { Table } from '@components/pdf/PDFTable';
import { ReportPage } from '@components/pdf/PDFComponents';

const headers = [
  'ID',
  'Nome',
  'Situação',
  'Subst.',
  'Recibo',
  'Assin.',
  'FGTS',
  'INSS',
  'VT',
];

interface Props {
  employees: Report[];
}

export const TableReport = ({ employees }: Props) => {
  const fields = headers.map((name) => {
    const width = name === 'Nome' || name === 'Situação' ? 80 : 40;
    return { name, width };
  });

  const rows = employees.map((e, index) => ({
    ID: index + 1,
    Nome: e.nome,
    Situação: e.situacao,
    'Subst.': e.substituto ? 'Sim' : 'Não',
    Recibo: e.tem_recibo ? 'Sim' : 'Não',
    'Assin.': e.tem_assinatura ? 'Sim' : 'Não',
    FGTS: e.FGTS ? 'Sim' : 'Não',
    INSS: e.INSS ? 'Sim' : 'Não',
    VT: e.VT ? 'Sim' : 'Não',
  }));

  return (
    <ReportPage sectionName="Funcionários">
      <Table fields={fields} rows={rows} />
    </ReportPage>
  );
};
