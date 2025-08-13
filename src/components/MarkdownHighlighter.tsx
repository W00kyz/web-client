import React, { useState, useRef } from 'react';
import {
  Paper,
  Stack,
  Typography,
  Divider,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLabelExampleContext } from '@hooks/useLabelExample';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

interface MarkdownHighlighterProps {
  nameFile: string;
  markdownContent: string;
  highlightRegex?: string | null;
}

const CONTEXT_WORDS_TOTAL = 20; // N = 6 (exemplo: 3 antes + 3 depois)

export const MarkdownHighlighter = ({
  nameFile,
  markdownContent,
  highlightRegex,
}: MarkdownHighlighterProps) => {
  const [openFullscreen, setOpenFullscreen] = useState(false);
  const [selection, setSelection] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const hasContent = markdownContent?.trim().length > 0;

  const { addOrUpdateLabel } = useLabelExampleContext();

  const fullTextRef = useRef(markdownContent); // Referência para o texto total

  const handleOpenFullscreen = () => setOpenFullscreen(true);
  const handleCloseFullscreen = () => setOpenFullscreen(false);

  const getContextWords = (
    fullText: string,
    selectedText: string
  ): string => {
    if (!fullText || !selectedText) {
      return "";
    }

    // --- 1. Encontrar um ponto de partida confiável (mesma lógica de antes) ---
    const searchSnippet = selectedText.substring(0, 70);
    const normalizedSnippet = searchSnippet.replace(/\s+/g, " ").trim();
    const escapedSnippet = normalizedSnippet.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const searchPattern = new RegExp(escapedSnippet.replace(/\s+/g, "\\s+"));
    const startIndex = fullText.search(searchPattern);

    if (startIndex === -1) {
      return selectedText; // Retorna a seleção se não encontrar o início
    }

    // --- 2. Criar um mapa de "palavras" do documento inteiro ---
    // Esta é a mudança crucial: usamos uma definição consistente de palavra.
    const wordsInDoc = [];
    // A regex /\S+/g encontra sequências de caracteres que não são espaços.
    // A flag 'd' (disponível em engines JS modernas) nos dá os índices de início/fim.
    const wordRegex = /\S+/gd; 
    let match;
    while ((match = wordRegex.exec(fullText)) !== null) {
      wordsInDoc.push({
        text: match[0],
        start: match.indices[0][0],
        end: match.indices[0][1],
      });
    }

    // --- 3. Encontrar o índice da palavra onde a seleção começa ---
    let startWordIndex = -1;
    for (let i = 0; i < wordsInDoc.length; i++) {
      // Se o caractere inicial da busca está dentro desta palavra
      if (wordsInDoc[i].start <= startIndex && startIndex < wordsInDoc[i].end) {
        startWordIndex = i;
        break;
      }
    }

    if (startWordIndex === -1) {
      return selectedText; // Fallback de segurança
    }

    // --- 4. Calcular os índices do contexto usando simples aritmética ---
    const CONTEXT_WORD_COUNT = 20;

    // Contar palavras na string da seleção
    const selectionWordCount = (selectedText.match(/\S+/g) || []).length;

    // A. Início do contexto
    const contextStartIndex = Math.max(0, startWordIndex - CONTEXT_WORD_COUNT);

    // B. Fim da seleção
    const selectionEndIndex = Math.min(
      wordsInDoc.length - 1,
      startWordIndex + selectionWordCount - 1
    );

    // C. Fim do contexto
    const contextEndIndex = Math.min(
      wordsInDoc.length - 1,
      selectionEndIndex + CONTEXT_WORD_COUNT
    );

    // --- 5. Extrair a fatia final do texto original ---
    // Pega a posição em CARACTERES da primeira e da última palavra do bloco de contexto
    const finalStartChar = wordsInDoc[contextStartIndex].start;
    const finalEndChar = wordsInDoc[contextEndIndex].end;

    return fullText.substring(finalStartChar, finalEndChar);
  };

  const handleMouseUp = () => {
    const selectedText = window.getSelection()?.toString().trim() ?? '';
    if (selectedText.length > 0) {
      setSelection(selectedText);
      setExampleInput(selectedText);
      setLabelInput('');
      fullTextRef.current = markdownContent;
      setOpenModal(true);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelection('');
    setLabelInput('');
    setExampleInput('');
  };

  const handleConfirm = () => {
    if (labelInput.trim() && exampleInput.trim()) {
      const context = getContextWords(
        fullTextRef.current,
        selection,
        CONTEXT_WORDS_TOTAL
      );
      addOrUpdateLabel(labelInput.trim(), {
        values: exampleInput.trim(),
        context,
      });
      handleModalClose();
    }
  };

  // Regex para highlight
  let regex: RegExp | null = null;
  try {
    if (highlightRegex) regex = new RegExp(highlightRegex, 'gi');
  } catch {
    regex = null;
  }

  // Função para quebrar texto em partes e destacar matches
  const renderTextWithHighlight = (text: string) => {
    if (!regex) return text;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;

      if (start > lastIndex) {
        parts.push(text.substring(lastIndex, start));
      }

      parts.push(
        <mark key={start} style={{ backgroundColor: 'yellow' }}>
          {text.substring(start, end)}
        </mark>
      );

      lastIndex = end;
      if (start === end) {
        regex.lastIndex++;
      }
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };

  // Custom components para markdown
  const components: Components = {
    h1: ({ node, ...props }) => (
      <>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            mt: 2,
            mb: 1,
          }}
          {...props}
        />
        <Divider sx={{ mb: 2 }} />
      </>
    ),
    p: ({ node, children, ...props }) => {
      const text = React.Children.toArray(children)
        .map((c) => (typeof c === 'string' ? c : ''))
        .join('');
      return (
        <Typography
          variant="body1"
          sx={{ fontFamily: 'Roboto, sans-serif', mb: 1 }}
          {...props}
        >
          {renderTextWithHighlight(text)}
        </Typography>
      );
    },
    table: ({ node, ...props }) => (
      <Box sx={{ overflowX: 'auto', width: '100%', display: 'block' }}>
        <Paper
          variant="outlined"
          sx={{ my: 2, borderRadius: 1, width: '100%', display: 'block' }}
        >
          <table {...props} />
        </Paper>
      </Box>
    ),
    thead: ({ node, ...props }) => <thead {...props} />,
    tbody: ({ node, ...props }) => <tbody {...props} />,
    tr: ({ node, ...props }) => <tr {...props} />,
    th: ({ node, ...props }) => (
      <th
        style={{
          fontWeight: 'bold',
          fontFamily: 'Roboto, sans-serif',
          backgroundColor: '#f5f5f5',
          whiteSpace: 'nowrap',
        }}
        {...props}
      />
    ),
    td: ({ node, ...props }) => (
      <td
        style={{ fontFamily: 'Roboto, sans-serif', whiteSpace: 'nowrap' }}
        {...props}
      />
    ),
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ width: '100%', maxWidth: 1200, minWidth: 600 }}
      >
        <Stack my={1}>
          <Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={2}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                }}
              >
                {nameFile}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton
                  aria-label="fullscreen"
                  onClick={handleOpenFullscreen}
                  size="small"
                >
                  <FullscreenIcon />
                </IconButton>
              </Stack>
            </Stack>
            <Stack direction={'row'} spacing={1} mx={2} alignItems={'center'}>
              <InfoOutlineIcon />
              <Typography variant="subtitle1">
                Selecione um parte de texto abaixo para criar um rótulo com
                exemplo.
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Box
            onMouseUp={handleMouseUp}
            sx={{
              px: 2,
              py: 1,
              maxHeight: 800,
              overflowY: 'auto',
              overflowX: 'auto',
              width: '100%',
              boxSizing: 'border-box',
              display: 'block',
              cursor: 'text',
              userSelect: 'text',
            }}
          >
            {hasContent ? (
              <ReactMarkdown
                components={components}
                remarkPlugins={[remarkGfm]}
              >
                {markdownContent}
              </ReactMarkdown>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  color: 'text.secondary',
                }}
              >
                Não foi possível obter o conteúdo.
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      <Dialog
        open={openModal}
        onClose={handleModalClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Adicionar Exemplo para Rótulo
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Rótulo"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              autoFocus
              fullWidth
            />
            <TextField
              label="Exemplo"
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose}>Cancelar</Button>
          <Button
            onClick={handleConfirm}
            disabled={!labelInput.trim() || !exampleInput.trim()}
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openFullscreen}
        onClose={handleCloseFullscreen}
        slotProps={{
          paper: { sx: { width: '100%', maxWidth: '794px', height: '90vh' } },
        }}
      >
        <Stack sx={{ p: 2, height: '100%', boxSizing: 'border-box' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
            >
              {nameFile}
            </Typography>
            <IconButton aria-label="close" onClick={handleCloseFullscreen}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              overflowX: 'auto',
              width: '100%',
              boxSizing: 'border-box',
              cursor: 'text',
              userSelect: 'text',
            }}
            onMouseUp={handleMouseUp}
          >
            {hasContent ? (
              <ReactMarkdown
                components={components}
                remarkPlugins={[remarkGfm]}
              >
                {markdownContent}
              </ReactMarkdown>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  color: 'text.secondary',
                }}
              >
                Não foi possível obter o conteúdo.
              </Typography>
            )}
          </Box>
        </Stack>
      </Dialog>
    </>
  );
};
