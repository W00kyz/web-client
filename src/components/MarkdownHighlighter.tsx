import {
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown, { Components } from 'react-markdown';

// Definição dos componentes customizados para o ReactMarkdown
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
};

interface MarkdownHighlighterProps {
  nameFile: string;
  markdownContent: string;
}

export const MarkdownHighlighter = ({
  nameFile,
  markdownContent,
}: MarkdownHighlighterProps) => {
  return (
    <Paper sx={{ minWidth: '600px' }}>
      <Stack>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={2}
        >
          <Typography variant="subtitle1" fontFamily="Roboto, sans-serif">
            {nameFile}
          </Typography>
          <IconButton>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Markdown */}
        <Stack px={2}>
          <ReactMarkdown components={markdownComponents}>
            {markdownContent}
          </ReactMarkdown>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Button variant="contained" color="primary">
          Salvar
        </Button>
      </Stack>
    </Paper>
  );
};
