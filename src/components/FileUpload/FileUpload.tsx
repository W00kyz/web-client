import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Input,
  Typography,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import type { FileUploadProps } from "@/types/props";

export const FileUpload: React.FC<FileUploadProps> = ({
  variant = "button",
  multiple = false,
  url = "",
  auto = false,
  onUpload = () => {},
  fileMaxSize,
  allowedExtensions,
  onError,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    let hasError = false;

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];

      newFiles.forEach((file) => {
        // Verifica extensão
        const extensionOk =
          !allowedExtensions ||
          allowedExtensions.some((ext) =>
            file.name.toLowerCase().endsWith(ext.toLowerCase())
          );

        if (!extensionOk) {
          const msg = `Extensão não permitida: ${file.name}`;
          if (onError) onError(msg);
          hasError = true;
          return;
        }

        // Verifica tamanho máximo
        if (fileMaxSize && file.size > fileMaxSize) {
          const msg = `Arquivo "${file.name}" excede o tamanho máximo (${(
            fileMaxSize /
            1024 /
            1024
          ).toFixed(2)} MB)`;
          if (onError) onError(msg);
          hasError = true;
          return;
        }

        // Verifica duplicados
        const alreadyExists = updatedFiles.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (!alreadyExists) {
          updatedFiles.push(file);
        }
      });

      return updatedFiles;
    });

    if (auto && url && !hasError) {
      simulateUpload(newFiles);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const simulateUpload = (filesToUpload: File[]) => {
    console.log(`Enviando para ${url}:`, filesToUpload);
    onUpload(filesToUpload);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const renderButton = () => (
    <Button
      variant="contained"
      startIcon={<CloudUploadIcon />}
      onClick={() => inputRef.current?.click()}
    >
      Enviar Arquivo
    </Button>
  );

  const renderInput = () => (
    <Stack
      direction="row"
      alignItems="center"
      border={"1px solid grey"}
      borderRadius={1}
      overflow="hidden"
      height={40}
    >
      <Button
        onClick={() => inputRef.current?.click()}
        sx={{
          height: "100%",
          backgroundColor: "#e0e0e0",
          "&:hover": {
            backgroundColor: "#d5d5d5",
          },
          borderRadius: 0,
          paddingX: 2,
          whiteSpace: "nowrap",
        }}
      >
        Escolher Arquivo
      </Button>

      <Stack
        direction="row"
        alignItems="center"
        flex={1}
        spacing={1}
        paddingX={2}
        sx={{
          backgroundColor: "#fafafa",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {files.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum arquivo selecionado
          </Typography>
        ) : (
          files.map((file, index) => (
            <Chip
              key={`${file.name}-${index}`}
              label={file.name}
              onDelete={() => removeFile(index)}
              size="small"
            />
          ))
        )}
      </Stack>

      {files.length > 0 && (
        <IconButton
          onClick={clearFiles}
          sx={{
            height: "100%",
            borderRadius: 0,
            backgroundColor: "#fafafa",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </Stack>
  );

  const renderDragDrop = () => (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      sx={{
        border: "2px dashed #aaa",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        cursor: "pointer",
      }}
      onClick={() => inputRef.current?.click()}
    >
      <CloudUploadIcon fontSize="large" color="action" />
      <Typography variant="body1" mt={2}>
        Arraste e solte arquivos aqui ou clique para enviar
      </Typography>
    </Box>
  );

  return (
    <>
      <Input
        type="file"
        inputRef={inputRef}
        onChange={handleInputChange}
        inputProps={{
          multiple,
          accept: allowedExtensions?.join(","),
        }}
        sx={{ display: "none" }}
      />
      <Box>
        {variant === "button" && renderButton()}
        {variant === "input" && renderInput()}
        {variant === "dragdrop" && renderDragDrop()}

        {files.length > 0 && (
          <Box mt={2}>
            {!auto && url && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => simulateUpload(files)}
              >
                Enviar agora
              </Button>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};
