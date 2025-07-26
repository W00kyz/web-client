import { pdf, Document } from '@react-pdf/renderer';

export async function openPdfInNewTab(
  document: React.ReactElement<typeof Document>
) {
  const asPdf = pdf();
  asPdf.updateContainer(document);
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
