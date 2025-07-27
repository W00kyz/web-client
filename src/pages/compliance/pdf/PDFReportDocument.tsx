import { Document } from '@react-pdf/renderer';

import { ReportCoverPage } from '@pages/compliance/pdf/PDFReportCoverPage';
import { ReportSummaryPage } from '@pages/compliance/pdf/PDFReportSummaryPage';
import { TableReportPage } from '@pages/compliance/pdf/TableReportPage';
import { ReportObservationsPage } from '@pages/compliance/pdf/ReportObservationsPage';

import { Report } from '@datasources/report';

interface PdfReportDocumentProps {
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

export const PdfReportDocument = ({ employees }: PdfReportDocumentProps) => {
  const hasObservations = employees.some((e) => e.observacao?.trim());

  return (
    <Document>
      <ReportCoverPage
        title="Relatório de Conformidade"
        companyName="Exemplo S/A"
        date={formatCurrentDate()}
      />
      <ReportSummaryPage reports={employees} />
      <TableReportPage employees={employees} />
      {hasObservations && <ReportObservationsPage employees={employees} />}
    </Document>
  );
};
