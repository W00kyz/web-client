import { PDFViewer } from "@react-pdf/renderer";

interface PDFPreviewProps {
  document: React.ReactElement;
}

export const PDFPreview = ({ document }: PDFPreviewProps) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>{document}</PDFViewer>
  );
};
