import { Document } from '@react-pdf/renderer';
import ReportCover from './PDFReportCover';
import ReportSummary from './PDFReportSummary';
import { TableReport } from '@components/pdf/conformity_report/TableReport';
import { ReportObservations } from '@components/pdf/conformity_report/ReportObservations';
import { Report } from '@datasources/report';

interface PdfReportProps {
  employees: Report[];
}

const formatCurrentDate = (): string => {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const now = new Date();
  return `${months[now.getMonth()]} de ${now.getFullYear()}`;
};

const PdfReport = ({ employees }: PdfReportProps) => {
  const hasObservations = employees.some((e) => e.observacao?.trim());

  return (
    <Document>
      <ReportCover
        title="Relatório de Conformidade"
        companyName="Exemplo S/A"
        date={formatCurrentDate()}
      />
      <ReportSummary reports={employees} />
      <TableReport employees={employees} />
      {hasObservations && <ReportObservations employees={employees} />}
    </Document>
  );
};

export default PdfReport;
