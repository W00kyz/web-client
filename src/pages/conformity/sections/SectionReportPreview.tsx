import PdfReport from '@components/pdf/conformity_report/PDFReport';
import { PDFPreview } from '@components/pdf/PDFPreview';
import Section from '@components/Section';
import { Report } from '@datasources/report';
import { mockReport } from '@utils/mockEmployees';

interface SectionReportPreviewProps {
  report: Report | null;
}

export const SectionReportPreview = ({ report }: SectionReportPreviewProps) => {
  const data = report ? [report] : mockReport;

  return (
    <Section title="Preview do Relatório">
      <PDFPreview document={<PdfReport employees={data} />} />
    </Section>
  );
};
