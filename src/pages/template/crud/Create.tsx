import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import { PageContainer } from '@toolpad/core';
import ClearIcon from '@mui/icons-material/Clear';
import LabelIcon from '@mui/icons-material/Label';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileInput from '@components/FileInput';
import { useMutation } from '@hooks/useMutation';
import { fileUploadDataSource } from '@datasources/upload';
import {
  templateDataSources,
  templateRuleDataSource,
} from '@datasources/template';
import { MarkdownHighlighter } from '@components/MarkdownHighlighter';
import { useSession } from '@hooks/useSession';

interface Rule {
  key: string;
  values: string[];
  isSection: boolean;
  finalized: boolean;
}

interface CreateTemplateProps {
  onCreate: () => void;
}

export const CreateTemplate = ({ onCreate }: CreateTemplateProps) => {
  const { session } = useSession();
  const [templateName, setTemplateName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [rules, setRules] = useState<Rule[]>([]);
  const [regexList, setRegexList] = useState<string[]>([]);
  const [activeRuleIndex, setActiveRuleIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState('');
  const [modalValue, setModalValue] = useState('');
  const [modalIsSection, setModalIsSection] = useState(false);
  const [modalSelectedText, setModalSelectedText] = useState('');
  const [modalIsSectionDisabled, setModalIsSectionDisabled] = useState(false);
  const activeKeyRef = useRef<HTMLInputElement | null>(null);

  const fileUpload = useMutation(fileUploadDataSource.uploadFile, {
    onSuccess: (result) => {
      setMarkdownContent(result.document_md || '');
    },
  });

  useEffect(() => {
    if (selectedFile) {
      setMarkdownContent('');
      fileUpload.mutate({ file: selectedFile, token: session?.user.token });
    }
  }, [selectedFile]);

  useEffect(() => {
    if (
      activeRuleIndex !== null &&
      !rules[activeRuleIndex]?.finalized &&
      activeKeyRef.current
    ) {
      activeKeyRef.current.focus();
    }
  }, [activeRuleIndex, rules]);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection) return;
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    setModalSelectedText(selectedText);
    setModalValue(selectedText);

    if (activeRuleIndex !== null && !rules[activeRuleIndex]?.finalized) {
      const currentRule = rules[activeRuleIndex];
      setModalKey(currentRule.key);
      setModalIsSection(currentRule.isSection);
      setModalIsSectionDisabled(true);
    } else {
      setModalKey('');
      setModalIsSection(false);
      setModalIsSectionDisabled(false);
    }

    setModalOpen(true);
    selection.removeAllRanges();
  }, [activeRuleIndex, rules]);

  const handleModalClose = useCallback(() => setModalOpen(false), []);

  // Usando a mutação que já espera o formato correto e retorno completo
  const ruleMutation = useMutation(templateRuleDataSource.createOne);

  const finalizeRule = useCallback(() => {
    if (activeRuleIndex === null) return;
    if (!selectedFile) return;

    const rule = rules[activeRuleIndex];

    ruleMutation.mutate(
      {
        data: {
          documentId: 1,
          selections: [
            {
              key: rule.key,
              values: rule.values,
            },
          ],
          isSection: rule.isSection,
        },
        token: session?.user.token,
      },
      {
        onSuccess: (response) => {
          console.log(response?.pattern);

          if (response?.pattern) {
            setRegexList((prev) => [...prev, response.pattern]);
          }

          setRules((prev) => {
            const copy = [...prev];
            copy[activeRuleIndex].finalized = true;
            return copy;
          });

          setActiveRuleIndex(null);
        },
        onError: (error) => {
          console.error('Erro ao gerar regex:', error);
        },
      }
    );
  }, [activeRuleIndex, rules, ruleMutation, selectedFile]);

  const updateRule = useCallback(
    (
      ruleIndex: number,
      field: 'key' | 'value',
      value: string,
      valueIndex?: number
    ) => {
      setRules((prev) => {
        const copy = [...prev];
        const rule = copy[ruleIndex];
        if (field === 'key') rule.key = value;
        if (field === 'value' && valueIndex !== undefined)
          rule.values[valueIndex] = value;
        return copy;
      });
    },
    []
  );

  const addValueToRule = useCallback((ruleIndex: number) => {
    setRules((prev) => {
      const copy = [...prev];
      const rule = copy[ruleIndex];
      const newValues = [...rule.values, ''];
      copy[ruleIndex] = { ...rule, values: newValues };
      return copy;
    });
  }, []);

  const removeValueFromRule = useCallback(
    (ruleIndex: number, valueIndex: number) => {
      setRules((prev) => {
        const copy = [...prev];
        if (copy[ruleIndex].values.length > 1) {
          copy[ruleIndex].values.splice(valueIndex, 1);
        }
        return copy;
      });
    },
    []
  );

  const removeRule = useCallback((ruleIndex: number) => {
    setRules((prev) => {
      const copy = [...prev];
      copy.splice(ruleIndex, 1);
      return copy;
    });
    setActiveRuleIndex(null);
  }, []);

  const addManualRule = useCallback(() => {
    if (activeRuleIndex !== null && !rules[activeRuleIndex]?.finalized) {
      alert('Finalize a regra atual antes de adicionar outra.');
      return;
    }
    const newRule: Rule = {
      key: '',
      values: [''],
      isSection: false,
      finalized: false,
    };
    setRules((prev) => [...prev, newRule]);
    setActiveRuleIndex(rules.length);
  }, [activeRuleIndex, rules]);

  const handleModalConfirm = useCallback(() => {
    const trimmedKey = modalKey.trim();
    const trimmedValue = modalValue.trim();

    if (!trimmedKey) {
      alert('Digite a chave!');
      return;
    }

    const existingRuleIndex = rules.findIndex(
      (r) => r.key === trimmedKey && !r.finalized
    );

    if (existingRuleIndex !== -1) {
      const existingRule = rules[existingRuleIndex];

      if (existingRule.isSection !== modalIsSection) {
        alert(
          `Esta chave já está sendo usada como uma regra do tipo "${
            existingRule.isSection ? 'Seção' : 'Comum'
          }".`
        );
        return;
      }

      setRules((prev) => {
        const copy = [...prev];
        const values = copy[existingRuleIndex].values;

        const emptyIndex = values.findIndex((v) => v === '');
        if (emptyIndex !== -1) {
          values[emptyIndex] = trimmedValue;
        } else if (!values.includes(trimmedValue)) {
          values.push(trimmedValue);
        }

        return copy;
      });

      setActiveRuleIndex(existingRuleIndex);
      setModalOpen(false);
      return;
    }

    if (activeRuleIndex !== null && !rules[activeRuleIndex]?.finalized) {
      alert('Finalize a regra atual antes de adicionar outra.');
      return;
    }

    const newRule: Rule = {
      key: trimmedKey,
      values: [trimmedValue],
      isSection: modalIsSection,
      finalized: false,
    };

    setRules((prev) => [...prev, newRule]);
    setActiveRuleIndex(rules.length);
    setModalOpen(false);
  }, [modalKey, modalValue, modalIsSection, rules, activeRuleIndex]);

  const saveTemplateMutation = useMutation(templateDataSources.createOne);

  const handleSaveTemplate = useCallback(() => {
    saveTemplateMutation.mutate(
      {
        name: templateName,
        rules: regexList,
      },
      {
        onSuccess: onCreate,
      }
    );
  }, [templateName, regexList, onCreate, saveTemplateMutation]);

  const renderedRules = useMemo(
    () =>
      rules.map((rule, ruleIndex) => (
        <Box key={ruleIndex} sx={{ p: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <TextField
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  style: { fontSize: 20, fontWeight: 500 },
                },
              }}
              size="small"
              value={rule.key}
              onChange={(e) => updateRule(ruleIndex, 'key', e.target.value)}
              sx={{ flex: 1 }}
              disabled={rule.finalized}
              inputRef={
                activeRuleIndex === ruleIndex ? activeKeyRef : undefined
              }
            />

            <Tooltip title={rule.isSection ? 'Regra Seção' : 'Regra Comum'}>
              <IconButton
                size="small"
                onClick={() => {
                  if (!rule.finalized) {
                    setRules((prev) => {
                      const copy = [...prev];
                      copy[ruleIndex] = {
                        ...copy[ruleIndex],
                        isSection: !copy[ruleIndex].isSection,
                      };
                      return copy;
                    });
                  }
                }}
                disabled={rule.finalized}
              >
                <LabelIcon
                  sx={{ color: rule.isSection ? 'yellow' : 'white' }}
                />
              </IconButton>
            </Tooltip>

            <IconButton
              size="small"
              onClick={() => removeRule(ruleIndex)}
              disabled={rule.finalized}
            >
              <ClearIcon />
            </IconButton>
          </Stack>

          <Stack spacing={1}>
            {rule.values.map((val, valIndex) => (
              <Stack
                key={valIndex}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <TextField
                  label={`Valor #${valIndex + 1}`}
                  multiline
                  size="small"
                  value={val}
                  onChange={(e) =>
                    updateRule(ruleIndex, 'value', e.target.value, valIndex)
                  }
                  sx={{ flex: 1 }}
                  disabled={rule.finalized}
                />
                <IconButton
                  size="small"
                  onClick={() => removeValueFromRule(ruleIndex, valIndex)}
                  disabled={rule.finalized || rule.values.length === 1}
                >
                  <ClearIcon />
                </IconButton>
              </Stack>
            ))}
            <Button
              size="small"
              onClick={() => addValueToRule(ruleIndex)}
              disabled={rule.finalized}
            >
              + Adicionar valor
            </Button>
          </Stack>
        </Box>
      )),
    [
      rules,
      activeRuleIndex,
      updateRule,
      removeRule,
      removeValueFromRule,
      addValueToRule,
    ]
  );

  return (
    <PageContainer>
      <Paper variant="outlined">
        <Stack m={2} gap={2}>
          <TextField
            label="Nome do Template"
            fullWidth
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />

          <FileInput
            label="Upload de arquivo .pdf"
            file={selectedFile}
            accept=".pdf"
            onChange={setSelectedFile}
          />

          {markdownContent && (
            <>
              <Typography variant="h6">
                Selecione um trecho do contrato ao lado com o mouse para criar
                uma nova regra.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Box
                  flex={1}
                  p={2}
                  border="1px solid #ccc"
                  borderRadius={2}
                  sx={{
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto',
                    maxHeight: 500,
                    userSelect: 'text',
                    cursor: 'text',
                  }}
                  onMouseUp={handleTextSelection}
                >
                  <MarkdownHighlighter
                    markdown={markdownContent}
                    regexes={regexList}
                  />
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    flex: 1,
                    p: 2,
                    maxHeight: 500,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    overflowY: 'auto',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    Regras
                    <Tooltip title="Regras aplicadas ao contrato" arrow>
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>

                  {rules.length === 0 && (
                    <Typography color="textSecondary">
                      Selecione um trecho e defina a primeira regra.
                    </Typography>
                  )}

                  {renderedRules}

                  {activeRuleIndex !== null &&
                    !rules[activeRuleIndex]?.finalized && (
                      <Box textAlign="right" mt={1}>
                        <Button variant="contained" onClick={finalizeRule}>
                          Enviar regra
                        </Button>
                      </Box>
                    )}

                  <Box textAlign="center" mt={1}>
                    <Button
                      variant="outlined"
                      onClick={addManualRule}
                      disabled={activeRuleIndex !== null}
                    >
                      + Adicionar regra
                    </Button>
                  </Box>

                  <Box textAlign="right" mt={2}>
                    <Button variant="contained" onClick={handleSaveTemplate}>
                      Salvar Template
                    </Button>
                  </Box>
                </Paper>
              </Stack>
            </>
          )}

          <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>Nova regra</DialogTitle>
            <DialogContent>
              <Typography variant="body2" mb={2}>
                Texto selecionado: <em>{modalSelectedText}</em>
              </Typography>
              <TextField
                label="Chave"
                fullWidth
                value={modalKey}
                onChange={(e) => {
                  const key = e.target.value;
                  setModalKey(key);
                  const existingRule = rules.find(
                    (r) => r.key === key.trim() && !r.finalized
                  );
                  if (existingRule) {
                    setModalIsSection(existingRule.isSection);
                    setModalIsSectionDisabled(true);
                  } else {
                    setModalIsSection(false);
                    setModalIsSectionDisabled(false);
                  }
                }}
                margin="dense"
              />
              <TextField
                label="Valor"
                multiline
                fullWidth
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                margin="dense"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={modalIsSection}
                    onChange={(e) => setModalIsSection(e.target.checked)}
                    disabled={modalIsSectionDisabled}
                  />
                }
                label="Seção"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalClose}>Cancelar</Button>
              <Button variant="contained" onClick={handleModalConfirm}>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Paper>
    </PageContainer>
  );
};
