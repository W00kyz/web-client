import { useState } from 'react';
import { PageContainer } from '@toolpad/core/PageContainer';
import { SectionUploadFiles } from './sections/SectionUploadFiles';
import { SectionReportPreview } from './sections/SectionReportPreview';
import { Report, reportDataSource } from '@datasources/report';

export const ConformityPage = () => {
  const [report, setReport] = useState<Report | null>(null);

  return (
    <PageContainer>
      <SectionUploadFiles
        onUploadSuccess={setReport}
        dataSource={reportDataSource}
      />
      <SectionReportPreview report={report} />
    </PageContainer>
  );
};
