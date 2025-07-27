import { reportDataSource } from '@datasources/report';
import { ComplianceCrudPage } from './ComplianceCrudPage';
import { PageContainer } from '@toolpad/core';
import { PdfSelectionSection } from './sections/SectionSelectionPdf';

export const ConformityPage = () => {
  return (
    <PageContainer title="Conformidade">
      <ComplianceCrudPage reportDataSource={reportDataSource} />
      <PdfSelectionSection />
    </PageContainer>
  );
};
