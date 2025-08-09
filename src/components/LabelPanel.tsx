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
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Stack gap={1} marginTop={1}>
          {examples.map((example, idx) => (
            <Stack key={idx} direction="row" spacing={1} alignItems="center">
              <TextField
                value={example}
                variant="outlined"
                size="small"
                fullWidth
              />
              <IconButton
                size="small"
                color="inherit"
                onClick={() => onRemoveExample?.(idx)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
          <Button
            color="primary"
            variant="contained"
            onClick={() => onSend}
            disabled={disabledSend}
          >
            Enviar
          </Button>
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface LabelPanelProps {
  templateTitle?: string;
  labels: Record<string, string[]>;
}

export const LabelPanel: React.FC<LabelPanelProps> = ({
  templateTitle = 'Rótulos',
  labels,
}) => {
  const [labelState, setLabelState] = useState(labels);
  const [visibleLabels, setVisibleLabels] = useState<Record<string, boolean>>(
    () => Object.fromEntries(Object.keys(labels).map((key) => [key, true]))
  );
  const [, setSentLabels] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState(templateTitle);

  const handleRemoveExample = (labelKey: string, idx: number) => {
    setLabelState((prev) => {
      const updated = { ...prev };
      updated[labelKey] = updated[labelKey].filter((_, i) => i !== idx);
      return updated;
    });
  };

  const handleSend = (labelKey: string) => {
    setSentLabels((prev) => new Set(prev).add(labelKey));
  };

  const handleRemoveLabel = (labelKey: string) => {
    setVisibleLabels((prev) => ({ ...prev, [labelKey]: false }));
    setTimeout(() => {
      setLabelState((prev) => {
        const updated = { ...prev };
        delete updated[labelKey];
        return updated;
      });
      setVisibleLabels((prev) => {
        const updated = { ...prev };
        delete updated[labelKey];
        return updated;
      });
    }, 350);
  };

  const labelKeys = Object.keys(labelState);

  return (
    <Paper sx={{ minWidth: 300 }}>
      <Stack>
        <Stack marginX={2} marginY={labelKeys.length > 0 ? 0 : 1}>
          <InputBase
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 500,
            }}
            fullWidth
          />
        </Stack>

        {labelKeys.length > 0 && <Divider sx={{ my: 1 }} />}

        {labelKeys.map((key, index) => (
          <React.Fragment key={key}>
            <Collapse in={visibleLabels[key]} timeout="auto" unmountOnExit>
              <LabelCard
                title={key}
                examples={labelState[key]}
                isSection={index === 0}
                disabledSend={labelState[key].length === 0}
                onRemoveExample={(idx) => handleRemoveExample(key, idx)}
                onSend={() => handleSend(key)}
                onRemoveLabel={() => handleRemoveLabel(key)}
              />
            </Collapse>
            {index < labelKeys.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </Stack>
    </Paper>
  );
};
