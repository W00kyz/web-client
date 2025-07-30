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

const BASE_URL = import.meta.env.VITE_API_URL;

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
  filename?: string;
}

const uploadDataSource = (_token: string) => ({
  createOne: async (file: File): Promise<DocumentDTO> => {
    const id = Math.floor(Math.random() * 10000);
    const now = new Date().toISOString();
    const content = `
# Relatório Técnico: ${file.name}

## Introdução

Este documento tem como objetivo apresentar uma análise detalhada dos processos realizados durante o período de referência. Todas as informações aqui contidas foram compiladas a partir de observações práticas, relatórios operacionais e registros internos do sistema de produção.

## Metodologia

A coleta de dados foi realizada diariamente ao longo de 30 dias, envolvendo três frentes principais: operações internas, controle de qualidade e suporte técnico. Cada equipe foi responsável por fornecer feedback detalhado sobre as ocorrências registradas em suas respectivas áreas.

## Resultados

Durante o período avaliado, observou-se uma melhora significativa na eficiência dos processos operacionais. O tempo médio de resposta às ocorrências reduziu em 12%, enquanto o índice de retrabalho caiu de 8,5% para 5,2%. Além disso, o uso adequado de recursos digitais otimizou o controle de documentos e reduziu erros de digitação em 23%.

O setor de controle de qualidade identificou 14 não conformidades, das quais 12 foram solucionadas dentro do prazo. As duas restantes foram encaminhadas para a equipe de engenharia, com prazo de retorno estipulado em cinco dias úteis. Os gráficos gerados mostram uma tendência positiva de redução de falhas críticas, principalmente nos processos automatizados.

## Análise

Os dados apontam que a integração de novos protocolos operacionais teve impacto direto na melhoria da performance da equipe. A comunicação entre os setores também foi favorecida após a adoção de reuniões semanais com foco em metas e indicadores-chave de desempenho.

Vale destacar que, mesmo com o aumento da demanda, os prazos foram respeitados em 97% dos atendimentos registrados. O uso de painéis informativos digitais contribuiu para o alinhamento rápido das tarefas e maior engajamento da equipe.

## Conclusão

Os resultados obtidos demonstram avanços significativos na organização dos fluxos de trabalho e no cumprimento das metas operacionais. Recomenda-se a continuidade das ações de monitoramento e a realização de treinamentos pontuais para manter o padrão de qualidade elevado.

A leitura e interpretação crítica destes dados são fundamentais para a tomada de decisões estratégicas futuras. O desempenho registrado durante este ciclo poderá servir como referência para o planejamento dos próximos trimestres.

## Anexos

- Tabela de Indicadores
- Gráficos de Ocorrências
- Lista de Procedimentos Atualizados
- Checklists de Auditoria Interna

---

Documento gerado em ${now}.
`;

    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id,
          user_id: 1,
          document_md: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          filename: file.name,
        });
      }, 500)
    );
  },
});

// 🔁 MOCK selectionDataSource
const selectionDataSource = (_token: string) => ({
  createOne: async (data: {
    documentId: number;
    selections: { key: string; values: string[]; context?: string }[];
  }) => {
    console.log('[MOCK] Dados enviados para /document/generate-regex:', data);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500)
    );
  },
});

// const uploadDataSource = (token: string) => ({
//   createOne: async (file: File): Promise<DocumentDTO> => {
//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await fetch(`${BASE_URL}:8000/document/upload`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Erro ao fazer upload do documento');
//     }

//     const data = await response.json();
//     return data as DocumentDTO;
//   },
// });

// const selectionDataSource = (token: string) => ({
//   createOne: async (data: {
//     documentId: number;
//     selections: { key: string; values: string[]; context?: string }[];
//   }) => {
//     const response = await fetch(`${BASE_URL}:8000/document/generate-regex`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error('Erro ao enviar seleções');
//     }

//     return await response.json();
//   },
// });

export const PdfSelectionSection = () => {
  const [, setFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [selections, setSelections] = useState<Record<number, Selection[]>>({});

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentContext, setCurrentContext] = useState('');

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
    uploadDataSource(token).createOne
  );

  const selectionMutation = useMutation(selectionDataSource(token).createOne);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).slice(0, 5);
    setFiles(newFiles);
    setDocuments([]);
    setSelections({});
    setModalOpen(true);

    newFiles.forEach((file) => {
      uploadMutation.mutate(file, {
        onSuccess: (doc) => {
          setDocuments((prev) => [...prev, { ...doc, filename: file.name }]);
        },
      });
    });
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
        setCurrentContext(context || '');
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
        currentContext
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
          Upload
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
        slotProps={{ paper: { sx: { height: '80vh' } } }}
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
            flexDirection: 'column',
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
                height: 600,
                p: 1,
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                📄 {doc.filename ?? 'Documento'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    flex: 2,
                    overflow: 'auto',
                    border: '1px solid #999',
                    borderRadius: 1,
                    p: 1,
                    cursor: 'text',
                    userSelect: 'text',
                    maxHeight: '100%',
                  }}
                  onMouseUp={() => handleTextSelection(index)}
                >
                  <ReactMarkdown>{doc.document_md}</ReactMarkdown>
                </Box>

                <Stack
                  spacing={1}
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    border: '1px solid #999',
                    borderRadius: 1,
                    p: 1,
                    maxHeight: '100%',
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
                            onClick={() =>
                              handleRemoveValue(index, item.key, i)
                            }
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
