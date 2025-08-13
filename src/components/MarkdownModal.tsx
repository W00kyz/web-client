import React from 'react';
import { Modal, Box, Typography, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MarkdownHighlighter } from '@components/MarkdownHighlighter';

interface MarkdownModalProps {
  open: boolean;
  onClose: () => void;
  markdownContent: string;
  regexList: string[]; // lista de regex em string para o highlight
  title?: string;
}

export const MarkdownModal: React.FC<MarkdownModalProps> = ({
  open,
  onClose,
  markdownContent,
  regexList,
  title = 'Documento',
}) => {
  // Combina todas as regex num só regex usando OR (|) para passar para o highlighter.
  const combinedRegex = regexList.length
    ? new RegExp(regexList.map((r) => `(${r})`).join('|'), 'g')
    : null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          overflowY: 'auto',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <MarkdownHighlighter
          markdownContent={markdownContent}
          highlightRegex={combinedRegex}
          nameFile="Documento"
        />
      </Box>
    </Modal>
  );
};
