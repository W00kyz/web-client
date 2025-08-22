// HtmlHighlighter.tsx
import React, { useState, useRef, useMemo } from 'react';
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
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import { useLabelExampleContext } from '@hooks/useLabelExample';

interface HtmlHighlighterProps {
  nameFile: string;
  htmlContent: string;
  highlightRegex?: string | RegExp | null;
}

const mapRegexBackendToFrontend = (regexString: string): string => {
  return regexString.replace(/\\Z/g, '$');
};

export const HtmlHighlighter = ({
  nameFile,
  htmlContent,
  highlightRegex,
}: HtmlHighlighterProps) => {
  const { addOrUpdateLabel } = useLabelExampleContext();

  const [openFullscreen, setOpenFullscreen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const fullTextRef = useRef(htmlContent);

  const hasContent = htmlContent?.trim().length > 0;

  const handleOpenFullscreen = () => setOpenFullscreen(true);
  const handleCloseFullscreen = () => setOpenFullscreen(false);

  const highlightedHtml = useMemo(() => {
    if (!htmlContent || !highlightRegex) return htmlContent || '';

    try {
      const regex =
        typeof highlightRegex === 'string'
          ? new RegExp(mapRegexBackendToFrontend(highlightRegex), 'g')
          : highlightRegex;

      return htmlContent.replace(regex, (match) => {
        return `<mark class="custom-highlight">${match}</mark>`;
      });
    } catch {
      return htmlContent;
    }
  }, [htmlContent, highlightRegex]);

  // 🔹 captura HTML selecionado
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // cria div temporária com o HTML da seleção
    const div = document.createElement('div');
    div.appendChild(range.cloneContents());
    const selectedHtml = div.innerHTML.trim();

    if (selectedHtml.length > 0) {
      setExampleInput(selectedHtml); // agora salva o HTML, não só o texto
      setLabelInput('');
      fullTextRef.current = htmlContent;
      setOpenModal(true);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setLabelInput('');
    setExampleInput('');
  };

  const handleConfirm = () => {
    if (labelInput.trim() && exampleInput.trim()) {
      addOrUpdateLabel(labelInput.trim(), exampleInput.trim());
      handleModalClose();
    }
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ width: '100%', maxWidth: 1200, minWidth: 600 }}
      >
        <Stack my={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px={2}
          >
            <Typography variant="h6">{nameFile}</Typography>
            <IconButton
              aria-label="fullscreen"
              onClick={handleOpenFullscreen}
              size="small"
            >
              <FullscreenIcon />
            </IconButton>
          </Stack>
          <Stack direction={'row'} spacing={1} mx={2} alignItems={'center'}>
            <InfoOutlineIcon />
            <Typography variant="subtitle1">
              Selecione uma parte de texto abaixo para criar um rótulo com
              exemplo.
            </Typography>
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
              cursor: 'text',
              userSelect: 'text',
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          {!hasContent && (
            <Typography variant="body2" color="text.secondary">
              Não foi possível obter o conteúdo.
            </Typography>
          )}
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
              label="Exemplo (HTML selecionado)"
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              fullWidth
              multiline
              minRows={3}
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
        PaperProps={{
          sx: { width: '100%', maxWidth: '794px', height: '90vh' },
        }}
      >
        <Stack sx={{ p: 2, height: '100%', boxSizing: 'border-box' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">{nameFile}</Typography>
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
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </Stack>
      </Dialog>
    </>
  );
};
