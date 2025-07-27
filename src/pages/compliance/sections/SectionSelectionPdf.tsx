import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@hooks/useMutation';
import ReactMarkdown from 'react-markdown';

interface Selection {
  key: string;
  values: string[];
}

interface DocumentDTO {
  id: number;
  user_id: number;
  document_md: string;
  created_at: string;
  updated_at: string;
}

const uploadDataSource = {
  createOne: async (file: File): Promise<DocumentDTO> => {
    const markdown = `# Documento ${file.name}\n\nEste é um documento mock em **markdown**.\n\nSelecione texto neste documento.`;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.floor(Math.random() * 1000),
          user_id: 1,
          document_md: markdown,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }, 1000);
    });
  },
};

const selectionDataSource = {
  createOne: async (data: {
    pdfIndex: number;
    documentId: number;
    selections: Selection[];
  }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('/generate-regex payload:', data);
        resolve(data);
      }, 1000);
    });
  },
};

export const PdfSelectionSection = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [selections, setSelections] = useState<Record<number, Selection[]>>({});

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');

  const [currentText, setCurrentText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const pendingSelection = useRef<{ index: number; text: string } | null>(null);

  const uploadMutation = useMutation<File, DocumentDTO>(
    uploadDataSource.createOne,
    {
      onSuccess: (doc) => {
        setDocuments((prev) => [...prev, doc]);
      },
    }
  );

  const selectionMutation = useMutation(selectionDataSource.createOne, {
    onSuccess: () => {
      alert('Seleções enviadas com sucesso!');
    },
    onError: () => {
      alert('Erro ao enviar seleções.');
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).slice(0, 5);
    setFiles(newFiles);
    setDocuments([]);
    setSelections({});
    setModalOpen(true);
    newFiles.forEach((file) => uploadMutation.mutate(file));
  };

  const handleTextSelection = (index: number) => {
    const selection = window.getSelection()?.toString() ?? '';
    if (!selection) return;
    pendingSelection.current = { index, text: selection };
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (pendingSelection.current && !openDialog) {
        const { index, text } = pendingSelection.current;
        setCurrentIndex(index);
        setCurrentText(text);
        setInputKey('');
        setInputValue(text);
        setOpenDialog(true);
        pendingSelection.current = null;
      }
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [openDialog]);

  const handleConfirm = () => {
    if (currentIndex !== null && inputKey.trim()) {
      handleAddSelection(currentIndex, inputKey.trim(), inputValue);
    }
    setOpenDialog(false);
    setCurrentText('');
    setCurrentIndex(null);
  };

  // Alteração principal: cada chave pode ter múltiplos valores
  const handleAddSelection = (docIndex: number, key: string, value: string) => {
    setSelections((prev) => {
      const current = prev[docIndex] || [];
      const existingIndex = current.findIndex((item) => item.key === key);
      if (existingIndex >= 0) {
        // Adiciona novo valor na lista da chave existente (se não repetir)
        const existingValues = current[existingIndex].values;
        if (!existingValues.includes(value)) {
          const updatedValues = [...existingValues, value];
          const updated = [...current];
          updated[existingIndex] = { key, values: updatedValues };
          return { ...prev, [docIndex]: updated };
        }
        return prev;
      } else {
        // Cria nova chave com o valor em lista
        return {
          ...prev,
          [docIndex]: [...current, { key, values: [value] }],
        };
      }
    });
  };

  // Atualiza um valor específico na lista de valores da chave
  const handleUpdateValue = (
    docIndex: number,
    key: string,
    valueIndex: number,
    newValue: string
  ) => {
    setSelections((prev) => {
      const current = prev[docIndex] || [];
      const updated = current.map((item) => {
        if (item.key === key) {
          const newValues = [...item.values];
          newValues[valueIndex] = newValue;
          return { key, values: newValues };
        }
        return item;
      });
      return { ...prev, [docIndex]: updated };
    });
  };

  // Remove um valor específico da lista de valores da chave
  const handleRemoveValue = (
    docIndex: number,
    key: string,
    valueIndex: number
  ) => {
    setSelections((prev) => {
      const current = prev[docIndex] || [];
      const updated = current
        .map((item) => {
          if (item.key === key) {
            const newValues = [...item.values];
            newValues.splice(valueIndex, 1);
            return { key, values: newValues };
          }
          return item;
        })
        // Remove a chave se não tiver mais valores
        .filter((item) => item.values.length > 0);
      return { ...prev, [docIndex]: updated };
    });
  };

  // Remove toda uma chave
  const handleRemoveSelection = (docIndex: number, key: string) => {
    setSelections((prev) => {
      const current = prev[docIndex] || [];
      const filtered = current.filter((item) => item.key !== key);
      return { ...prev, [docIndex]: filtered };
    });
  };

  const handleSendSelections = (docIndex: number) => {
    const documentId = documents[docIndex]?.id ?? 0;
    const dataToSend = {
      pdfIndex: docIndex,
      documentId,
      selections: selections[docIndex] || [],
    };
    selectionMutation.mutate(dataToSend);
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Button
          variant="contained"
          component="label"
          disabled={uploadMutation.isLoading}
        >
          Selecione até 5 arquivos (markdown mock upload)
          <input
            type="file"
            hidden
            multiple
            accept=".md,.txt,.pdf"
            onChange={handleFileChange}
          />
        </Button>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="xl"
        PaperProps={{ sx: { height: '80vh' } }}
      >
        <DialogTitle>
          Visualização dos Documentos
          <IconButton
            aria-label="fechar"
            onClick={() => setModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            height: '100%',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {documents.map((doc, index) => (
            <Box
              key={doc.id}
              sx={{
                flex: '1 1 45%',
                height: 600,
                p: 1,
                boxSizing: 'border-box',
                display: 'flex',
                gap: 2,
                flexDirection: 'row',
                border: '1px solid #ccc',
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  flex: '1 1 60%',
                  overflow: 'auto',
                  border: '1px solid #999',
                  borderRadius: 1,
                  p: 1,
                  cursor: 'text',
                  userSelect: 'text',
                }}
                onMouseUp={() => handleTextSelection(index)}
              >
                <ReactMarkdown>{doc.document_md}</ReactMarkdown>
              </Box>

              <Stack
                spacing={1}
                sx={{
                  flex: '1 1 40%',
                  overflowY: 'auto',
                  border: '1px solid #999',
                  borderRadius: 1,
                  p: 1,
                  maxHeight: 580,
                }}
              >
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  fontWeight="bold"
                  gutterBottom
                >
                  Seleções
                </Typography>

                {(selections[index] || []).map((item) => (
                  <Box
                    key={item.key}
                    sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1 }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ mb: 0.5 }}
                    >
                      {item.key}
                      <IconButton
                        aria-label="remover chave"
                        onClick={() => handleRemoveSelection(index, item.key)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Typography>

                    {item.values.map((val, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                      >
                        <TextField
                          label="Valor"
                          value={val}
                          size="small"
                          onChange={(e) =>
                            handleUpdateValue(
                              index,
                              item.key,
                              i,
                              e.target.value
                            )
                          }
                          sx={{ flex: 1 }}
                        />
                        <IconButton
                          aria-label="remover valor"
                          onClick={() => handleRemoveValue(index, item.key, i)}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Box>
                ))}

                <Box textAlign="left" mt={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleSendSelections(index)}
                    disabled={
                      selectionMutation.isLoading ||
                      !(selections[index]?.length > 0)
                    }
                  >
                    {selectionMutation.isLoading ? 'Enviando...' : 'Enviar'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          ))}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nova Seleção</DialogTitle>
        <DialogContent>
          <TextField
            label="Informe a chave"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            fullWidth
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            label="Informe o valor"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!inputKey.trim()}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
