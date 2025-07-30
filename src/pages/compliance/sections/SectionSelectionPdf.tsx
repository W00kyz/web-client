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
import { useSession } from '@hooks/useSession';

interface Selection {
  key: string;
  values: string[];
  context?: string;
}

interface DocumentDTO {
  id: number;
  user_id: number;
  document_md: string;
  created_at: string;
  updated_at: string;
}

const uploadDataSource = (token: string) => ({
  createOne: async (file: File): Promise<DocumentDTO> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/document/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload do documento');
    }

    const data = await response.json();
    return data as DocumentDTO;
  },
});

const selectionDataSource = (token: string) => ({
  createOne: async (data: {
    documentId: number;
    selections: { key: string; values: string[]; context?: string }[];
  }) => {
    const response = await fetch('http://localhost:8000/document/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar seleções');
    }

    return await response.json();
  },
});

export const PdfSelectionSection = () => {
  const [, setFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [selections, setSelections] = useState<Record<number, Selection[]>>({});

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentContext, setCurrentContext] = useState(''); // ✅ Adicionado

  const [, setCurrentText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { session } = useSession();
  const token = session?.user?.token || '';

  const wordOffset = 10;

  const pendingSelection = useRef<{
    index: number;
    text: string;
    context?: string;
  } | null>(null);

  const uploadMutation = useMutation<File, DocumentDTO>(
    uploadDataSource(token).createOne,
    {
      onSuccess: (doc) => {
        setDocuments((prev) => [...prev, doc]);
      },
    }
  );

  const selectionMutation = useMutation(selectionDataSource(token).createOne, {
    onSuccess: () => {
      console.log('Seleções enviadas com sucesso!');
    },
    onError: () => {
      console.log('Erro ao enviar seleções.');
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
    const selection = window.getSelection();
    const selectedText = selection?.toString() ?? '';
    if (!selectedText) return;

    const fullText = documents[index]?.document_md ?? '';
    const normalizedFullText = fullText.replace(/\s+/g, ' ');
    const normalizedSelected = selectedText.trim();

    const matchIndex = normalizedFullText.indexOf(normalizedSelected);

    let context = '';
    if (matchIndex >= 0) {
      const words = normalizedFullText.split(' ');
      let selectedWordIndex = -1;
      let runningLength = 0;

      for (let i = 0; i < words.length; i++) {
        runningLength += words[i].length + 1;
        if (runningLength >= matchIndex + normalizedSelected.length / 2) {
          selectedWordIndex = i;
          break;
        }
      }

      const start = Math.max(0, selectedWordIndex - wordOffset);
      const end = Math.min(words.length, selectedWordIndex + wordOffset + 1);
      context = words.slice(start, end).join(' ');
    }

    pendingSelection.current = {
      index,
      text: selectedText,
      context,
    };
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (pendingSelection.current && !openDialog) {
        const { index, text, context } = pendingSelection.current;
        setCurrentIndex(index);
        setCurrentText(text);
        setCurrentContext(context || ''); // ✅ Correção aplicada
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
      handleAddSelection(
        currentIndex,
        inputKey.trim(),
        inputValue,
        currentContext // ✅ Correção aplicada
      );
    }
    setOpenDialog(false);
    setCurrentText('');
    setCurrentIndex(null);
  };

  const handleAddSelection = (
    docIndex: number,
    key: string,
    value: string,
    context: string
  ) => {
    setSelections((prev) => {
      const current = prev[docIndex] || [];
      const existingIndex = current.findIndex((item) => item.key === key);
      if (existingIndex >= 0) {
        const existingValues = current[existingIndex].values;
        if (!existingValues.includes(value)) {
          const updatedValues = [...existingValues, value];
          const updated = [...current];
          updated[existingIndex] = {
            key,
            values: updatedValues,
            context,
          };
          return { ...prev, [docIndex]: updated };
        }
        return prev;
      } else {
        return {
          ...prev,
          [docIndex]: [...current, { key, values: [value], context }],
        };
      }
    });
  };

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
          return { key, values: newValues, context: item.context };
        }
        return item;
      });
      return { ...prev, [docIndex]: updated };
    });
  };

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
            return { key, values: newValues, context: item.context };
          }
          return item;
        })
        .filter((item) => item.values.length > 0);
      return { ...prev, [docIndex]: updated };
    });
  };

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
      documentId,
      selections: (selections[docIndex] || []).map((sel) => ({
        key: sel.key,
        values: sel.values,
        context: sel.context || '',
      })),
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
