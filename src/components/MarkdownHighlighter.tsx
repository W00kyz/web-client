import {
  Button,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { useLabelExampleContext } from '@hooks/useLabelExample';

// Componentes customizados para ReactMarkdown
const markdownComponents: Components = {
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
  p: ({ node, ...props }) => (
    <Typography
      variant="body1"
      sx={{
        fontFamily: 'Roboto, sans-serif',
        mb: 1,
      }}
      {...props}
    />
  ),
  table: ({ node, ...props }) => (
    <Box
      sx={{
        overflowX: 'auto',
        width: '100%',
        display: 'block',
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          my: 2,
          border: '1px solid #ddd',
          borderRadius: 1,
          width: '100%',
          display: 'block',
        }}
      >
        <Table size="small" {...props} />
      </TableContainer>
    </Box>
  ),
  thead: ({ node, ...props }) => <TableHead {...props} />,
  tbody: ({ node, ...props }) => <TableBody {...props} />,
  tr: ({ node, ...props }) => <TableRow {...props} />,
  th: ({ node, ...props }) => (
    <TableCell
      sx={{
        fontWeight: 'bold',
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#f5f5f5',
        whiteSpace: 'nowrap',
      }}
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <TableCell
      sx={{
        fontFamily: 'Roboto, sans-serif',
        whiteSpace: 'nowrap',
      }}
      {...props}
    />
  ),
};

interface MarkdownHighlighterProps {
  nameFile: string;
  markdownContent: string;
}

export const MarkdownHighlighter = ({
  nameFile,
  markdownContent,
}: MarkdownHighlighterProps) => {
  const [openFullscreen, setOpenFullscreen] = useState(false);
  const [selection, setSelection] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const hasContent = markdownContent?.trim().length > 0;

  const { addOrUpdateLabel } = useLabelExampleContext();

  const handleOpenFullscreen = () => setOpenFullscreen(true);
  const handleCloseFullscreen = () => setOpenFullscreen(false);

  const handleMouseUp = () => {
    const selectedText = window.getSelection()?.toString().trim() ?? '';
    if (selectedText.length > 0) {
      setSelection(selectedText);
      setExampleInput(selectedText);
      setLabelInput('');
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
      addOrUpdateLabel(labelInput.trim(), {
        text: exampleInput.trim(),
        context: [],
      });
      handleModalClose();
    }
  };

  return (
    <>
      <Paper sx={{ width: '100%', maxWidth: 1200, minWidth: 600 }}>
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
              <IconButton size="small">
                <CloseIcon />
              </IconButton>
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
                components={markdownComponents}
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

          <Divider sx={{ my: 2 }} />

          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!hasContent}
              sx={{ minWidth: '200px', marginBottom: 2 }}
            >
              Salvar
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Adicionar Rótulo para seleção</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 400 }}>
            <TextField
              label="Rótulo"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="Exemplo"
              value={exampleInput}
              multiline
              rows={3}
              onChange={(e) => setExampleInput(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!labelInput.trim() || !exampleInput.trim()}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openFullscreen}
        onClose={handleCloseFullscreen}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: '21cm',
            height: '29.7cm',
            maxWidth: '100%',
            maxHeight: '100%',
            padding: 3,
            overflowY: 'auto',
            boxSizing: 'border-box',
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
        >
          {nameFile}
          <IconButton
            aria-label="close"
            onClick={handleCloseFullscreen}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {hasContent ? (
            <ReactMarkdown
              components={markdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {markdownContent}
            </ReactMarkdown>
          ) : (
            <Typography
              variant="body2"
              sx={{ fontFamily: 'Roboto, sans-serif', color: 'text.secondary' }}
            >
              Não foi possível obter o conteúdo.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
