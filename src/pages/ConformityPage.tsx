import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { PageContainer } from "@toolpad/core/PageContainer";
import FileInput from "../components/FileInput";

const ConformityPage = () => {
  const [files, setFiles] = React.useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Arquivos enviados:", files);
    alert("Arquivos enviados com sucesso!");
  };

  return (
    <PageContainer>
      <Typography variant="h5" mb={2}>
        Upload de Documentos
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {[...Array(5)].map((_, idx) => (
            <Box key={idx} mb={2}>
              <FileInput
                label={`Documento ${idx + 1}`}
                file={files[idx]}
                onChange={(file) => handleFileChange(idx, file)}
                accept="application/pdf,image/*"
              />
            </Box>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
        </Box>
      </Paper>
    </PageContainer>
  );
};

export default ConformityPage;
