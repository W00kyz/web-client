// HtmlHighlighter.tsx
import React from 'react';
import { Paper, Stack, Typography, Divider, Box } from '@mui/material';

interface HtmlHighlighterProps {
  nameFile: string;
  htmlContent: string;
}

export const HtmlHighlighter = ({
  nameFile,
  htmlContent,
}: HtmlHighlighterProps) => {
  const hasContent = htmlContent?.trim().length > 0;

  return (
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
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            px: 2,
            py: 1,
            maxHeight: 800,
            overflowY: 'auto',
            overflowX: 'auto',
            cursor: 'text',
            userSelect: 'text',
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {!hasContent && (
          <Typography variant="body2" color="text.secondary">
            Não foi possível obter o conteúdo.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};
