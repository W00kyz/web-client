import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { PageContainer } from "@toolpad/core/PageContainer";
import FileInput from "../components/FileInput";
import { useState } from "react";
import Section from "../components/Section";

import { openPdfInNewTab } from "@utils/pdfUtils";
import { mockEmployees } from "@utils/mockEmployees";
import PdfReport from "@components/pdf/PDFReport";
import { useSession } from "../SessionContext";

const fileLabels = [
  "funcionarios",
  "funcionarios_substitutos",
  "cartao_pontos",
  "cesta",
  "vt",
];

const ConformityPage = () => {
  const [files, setFiles] = useState<Record<string, File | null>>(
    Object.fromEntries(fileLabels.map((label) => [label, null]))
  );
  const user = useSession();

  const handleFileChange = (label: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [label]: file }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    for (const label of fileLabels) {
      const file = files[label];
      if (file) {
        formData.append(label, file);
      }
    }

    try {
      const response = await fetch("http://localhost:3000/report/upload", {
        headers: {
          Authorization: `Bearer ${user.session?.user.token}`,
        },
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro na resposta");

      const { data } = await response.json();

      await openPdfInNewTab(<PdfReport employees={data} />);
    } catch (error) {
      console.error("Erro ao enviar arquivos:", error);
      await openPdfInNewTab(<PdfReport employees={mockEmployees} />);
    }
  };

  return (
    <PageContainer>
      <Section title="Upload de Documentos">
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {fileLabels.map((label) => (
            <Box key={label} mb={2}>
              <FileInput
                label={label}
                file={files[label]}
                onChange={(file) => handleFileChange(label, file)}
                accept="application/pdf,image/*"
              />
            </Box>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
        </Box>
      </Section>
      {/* <Section>
        <PDFPreview document={<PdfReport employees={mockEmployees} />} />
      </Section> */}
    </PageContainer>
  );
};

export default ConformityPage;
