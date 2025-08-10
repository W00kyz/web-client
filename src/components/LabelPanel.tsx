// LabelPanel.tsx
import React, { useState } from 'react';
import {
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  InputBase,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLabelExampleContext } from '@hooks/useLabelExample';
import { TransitionGroup } from 'react-transition-group'; // ✅ Import adicionado para animações

interface LabelCardProps {
  title: string;
  examples: string[];
  isSection?: boolean;
  disabledSend?: boolean;
  onSend?: () => void;
  onRemoveExample?: (idx: number) => void;
  onRemoveLabel?: () => void;
}

const LabelCard = ({
  title,
  examples,
  isSection,
  disabledSend,
  onSend,
  onRemoveExample,
  onRemoveLabel,
}: LabelCardProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Stack padding={1}>
      {/* Cabeçalho */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontFamily={"'Roboto', sans-serif"}>{title}</Typography>
          {isSection && (
            <Chip
              label="Seção"
              size="small"
              color="secondary"
              variant="filled"
            />
          )}
        </Stack>

        <Stack direction="row">
          <IconButton size="small" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <IconButton size="small" onClick={onRemoveLabel}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Lista de Exemplos com animação */}
      <Collapse in={expanded} timeout={300} unmountOnExit>
        <Stack gap={1} marginTop={1}>
          <TransitionGroup>
            {examples.map((example, idx) => (
              <Collapse key={idx} timeout={300}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <TextField
                    value={example}
                    variant="outlined"
                    size="small"
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                  />
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => onRemoveExample?.(idx)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Collapse>
            ))}
          </TransitionGroup>

          <Button
            color="primary"
            variant="contained"
            onClick={onSend}
            disabled={disabledSend}
          >
            Enviar
          </Button>
        </Stack>
      </Collapse>
    </Stack>
  );
};

export const LabelPanel = () => {
  const { labels, removeExample, removeLabel } = useLabelExampleContext();
  const [visibleLabels, setVisibleLabels] = useState<Record<string, boolean>>(
    () => Object.fromEntries(Object.keys(labels).map((key) => [key, true]))
  );

  const handleRemoveExample = (labelKey: string, idx: number) => {
    removeExample(labelKey, idx);
  };

  const handleRemoveLabel = (labelKey: string) => {
    setVisibleLabels((prev) => ({ ...prev, [labelKey]: false }));
    setTimeout(() => {
      removeLabel(labelKey);
      setVisibleLabels((prev) => {
        const copy = { ...prev };
        delete copy[labelKey];
        return copy;
      });
    }, 300);
  };

  const labelKeys = Object.keys(labels);

  return (
    <Paper sx={{ minWidth: 300 }}>
      <Stack>
        <Stack marginX={2} marginY={labelKeys.length > 0 ? 0 : 1}>
          <InputBase
            value="Rótulos"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 500,
            }}
            fullWidth
            readOnly
          />
        </Stack>

        {labelKeys.length > 0 && <Divider sx={{ my: 1 }} />}

        {/* ✅ Animação para os cards */}
        <TransitionGroup>
          {labelKeys.map((key, index) => (
            <Collapse key={key} timeout={300}>
              <LabelCard
                title={key}
                examples={labels[key].examples.map((ex) => ex.text)}
                isSection={index === 0}
                disabledSend={labels[key].examples.length === 0}
                onRemoveExample={(idx) => handleRemoveExample(key, idx)}
                onSend={() => {}}
                onRemoveLabel={() => handleRemoveLabel(key)}
              />
              {index < labelKeys.length - 1 && <Divider sx={{ my: 1 }} />}
            </Collapse>
          ))}
        </TransitionGroup>
      </Stack>
    </Paper>
  );
};
