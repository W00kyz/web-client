import React, { useRef } from "react";
import {
  Box,
  Button,
  Input,
  Typography,
  IconButton,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import type { FileUploadProps } from "@customTypes/components";

export const FileUpload: React.FC<FileUploadProps> = ({
  variant = "button",
  multiple = false,
  url = "",
  auto = false,
  maxFiles,
  maxFileSize,
  allowedExtensions,
  value = [],
  onChange,
  name,
  disabled = false,
  placeholder,
  required = false,
  error,
  icon,
}) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const updatedFiles = [...value];

    newFiles.forEach((file) => {
      const extensionOk =
        !allowedExtensions ||
        allowedExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext.toLowerCase())
        );
      if (!extensionOk) return;

      if (maxFileSize && file.size > maxFileSize) return;

      const alreadyExists = updatedFiles.some(
        (f) => f.name === file.name && f.size === file.size
      );

      if (!alreadyExists) {
        if (!maxFiles || updatedFiles.length < maxFiles) {
          updatedFiles.push(file);
        }
      }
    });

    if (onChange) {
      onChange(updatedFiles);
    }

    if (auto && url) {
      simulateUpload(updatedFiles);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const simulateUpload = (filesToUpload: File[]) => {
    if (!url) {
      console.warn("FileUpload: auto=true mas url não foi informada.");
      return;
    }
    console.log(`Enviando para ${url}:`, filesToUpload);
    // Lógica de envio aqui, se necessário.
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    const updatedFiles = value.filter((_, i) => i !== index);
    if (onChange) {
      onChange(updatedFiles);
    }
  };

  const clearFiles = () => {
    if (onChange) {
      onChange([]);
    }
  };

  const isAtMaxFiles = maxFiles !== undefined && value.length >= maxFiles;

  const renderTopLabel = () => (
    <Typography
      variant="body2"
      sx={{
        mb: 0.5,
        color: error ? "error.main" : "text.primary",
        fontWeight: 500,
      }}
    >
      {placeholder || "Arquivo"}
      {required && (
        <Box
          component="span"
          sx={{ color: "error.main", ml: 0.5 }}
          aria-hidden="true"
        >
          *
        </Box>
      )}
    </Typography>
  );

  const renderLabel = () => (
    <>
      {placeholder ||
        (variant === "button" ? "Enviar Arquivo" : "Escolher Arquivo")}
      {required && (
        <Box
          component="span"
          sx={{ color: "error.main", ml: 0.5 }}
          aria-hidden="true"
        >
          *
        </Box>
      )}
    </>
  );

  const renderButton = () => (
    <Button
      variant="contained"
      startIcon={<FileUploadOutlinedIcon />}
      onClick={() => {
        if (!disabled && !isAtMaxFiles) inputRef.current?.click();
      }}
      disabled={disabled || isAtMaxFiles}
      sx={{
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }}
    >
      {renderLabel()}
    </Button>
  );

  const renderInput = () => (
    <Box>
      {renderTopLabel()}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          border: 1,
          borderColor: error ? "error.main" : "grey.400",
          borderRadius: 1,
          backgroundColor: disabled ? "grey.100" : "common.white",
          height: 56,
          paddingX: 1,
          cursor: disabled || isAtMaxFiles ? "not-allowed" : "pointer",
          "&:hover": {
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.primary.main,
            backgroundColor: disabled ? "grey.100" : theme.palette.action.hover,
          },
          transition: "border-color 0.3s, background-color 0.3s",
        }}
        onClick={() => {
          if (!disabled && !isAtMaxFiles) inputRef.current?.click();
        }}
      >
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 1,
              color: "action.active",
            }}
          >
            {icon}
          </Box>
        )}

        {/* Container dos chips e texto com scroll horizontal e nomes truncados */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            flex: 1,
            overflowX: "auto",
            whiteSpace: "nowrap",
            maxHeight: 40,
          }}
        >
          {value.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                color: error ? "error.main" : "text.secondary",
              }}
            >
              Nenhum arquivo selecionado
            </Typography>
          ) : (
            value.map((file: File, index: number) => (
              <Chip
                key={`${file.name}-${index}`}
                label={
                  <Box
                    sx={{
                      maxWidth: 120,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={file.name}
                  >
                    {file.name}
                  </Box>
                }
                onDelete={() => removeFile(index)}
                size="small"
              />
            ))
          )}
        </Stack>

        {value.length > 0 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              clearFiles();
            }}
            size="small"
            sx={{
              ml: 1,
              color: "action.active",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
    </Box>
  );

  const renderDragDrop = () => (
    <Box>
      {renderTopLabel()}
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: 2,
          borderStyle: "dashed",
          borderColor: error ? "error.main" : "#aaa",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          userSelect: "none",
          color: error ? "error.main" : "inherit",
          "&:hover": {
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.primary.main,
            backgroundColor: disabled
              ? "transparent"
              : theme.palette.action.hover,
          },
          transition: "border-color 0.3s, background-color 0.3s",
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
      >
        <FileUploadOutlinedIcon
          fontSize="large"
          color={error ? "error" : "action"}
        />
        <Typography variant="body1" mt={2}>
          {renderLabel()}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Input
        type="file"
        inputRef={inputRef}
        onChange={handleInputChange}
        inputProps={{
          multiple: multiple,
          accept: allowedExtensions?.join(","),
          name,
          required,
          disabled,
        }}
        sx={{ display: "none" }}
      />
      <Box>
        {variant === "button" && renderButton()}
        {variant === "input" && renderInput()}
        {variant === "dragdrop" && renderDragDrop()}

        {error && (
          <Typography
            variant="body2"
            color="error"
            mt={1}
            sx={{ fontWeight: "normal" }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </>
  );
};
