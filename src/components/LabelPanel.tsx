// LabelPanel.tsx
import React from 'react';
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
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TransitionGroup } from 'react-transition-group';
import { useMutation } from '@hooks/useMutation';
import {
  CreatedRule,
  CreateRuleInput,
  templateRuleDataSource,
} from '@datasources/template';
import InfoIcon from '@mui/icons-material/Info';
import { useSession } from '@hooks/useSession';
import { ExampleItem, useLabelExampleContext } from '@hooks/useLabelExample';

interface LabelCardProps {
  title: string;
  examples: ExampleItem[];
  isSection?: boolean;
  disabledSend?: boolean;
  loading?: boolean;
  error?: string | null;
  onSend: () => void;
  onRemoveExample?: (idx: number) => void;
  onRemoveLabel?: () => void;
}

const LabelCard = ({
  title,
  examples,
  isSection,
  disabledSend,
  loading,
  error,
  onSend,
  onRemoveExample,
  onRemoveLabel,
}: LabelCardProps) => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <Stack padding={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>{title}</Typography>
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
          <IconButton size="small" onClick={onRemoveLabel} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={expanded} timeout={300} unmountOnExit>
        <Stack gap={1} marginTop={1}>
          <TransitionGroup>
            {examples.map((example, idx) => (
              <Collapse key={idx} timeout={300}>
                <Stack direction="row" spacing={1} alignItems="center">
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
                    disabled={loading}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Collapse>
            ))}
          </TransitionGroup>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            color="primary"
            variant="contained"
            onClick={onSend}
            disabled={disabledSend || loading}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface LabelPanelProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  onNewRegex: (regex: string) => void;
}

export const LabelPanel = ({
  templateName,
  setTemplateName,
  onNewRegex,
}: LabelPanelProps) => {
  const { labels, removeExample, removeLabel } = useLabelExampleContext();
  const { session } = useSession();

  const { mutate, isLoading, error } = useMutation<
    { data: CreateRuleInput; token?: string },
    CreatedRule,
    Error
  >(async ({ data, token }) =>
    templateRuleDataSource.createOne({ data, token })
  );

  const [currentSendingLabel, setCurrentSendingLabel] = React.useState<
    string | null
  >(null);

  const handleRemoveExample = (labelKey: string, idx: number) =>
    removeExample(labelKey, idx);

  const handleRemoveLabel = (labelKey: string) => {
    onNewRegex('');
    setTimeout(() => removeLabel(labelKey), 300);
  };

  const handleSendClick = async (
    labelKey: string,
    examples: ExampleItem[],
    isSection?: boolean
  ) => {
    setCurrentSendingLabel(labelKey);

    const formattedData = {
      documentId: 1,
      isSection: isSection ?? false,
      key: labelKey,
      selections: examples, // array de strings
    };

    await mutate(
      { data: formattedData, token: session?.user.token },
      {
        onError: () => setCurrentSendingLabel(null),
        onSuccess: (data) => {
          setCurrentSendingLabel(null);
          if (data?.pattern) onNewRegex(data.pattern);
        },
      }
    );
  };

  const labelKeys = Object.keys(labels);

  return (
    <Paper variant="outlined" sx={{ minWidth: 300 }}>
      <Stack>
        <Stack
          direction={'row'}
          spacing={1}
          alignItems={'center'}
          marginX={2}
          marginY={labelKeys.length > 0 ? 0 : 1}
        >
          <Tooltip title="Rótulos são nomes para identificar dados relacionados, agrupam exemplos que são utilizados para extração de dados.">
            <InfoIcon style={{ cursor: 'pointer' }} />
          </Tooltip>
          <InputBase
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Digite o nome do template"
            fullWidth
          />
        </Stack>

        {labelKeys.length > 0 && <Divider sx={{ my: 1 }} />}

        <TransitionGroup>
          {labelKeys.map((key, index) => (
            <Collapse key={key} timeout={300}>
              <LabelCard
                title={key}
                examples={labels[key].examples}
                isSection={index === 0}
                disabledSend={labels[key].examples.length === 0}
                loading={isLoading && currentSendingLabel === key}
                error={
                  currentSendingLabel === key ? (error?.message ?? null) : null
                }
                onRemoveExample={(idx) => handleRemoveExample(key, idx)}
                onSend={() =>
                  handleSendClick(key, labels[key].examples, index === 0)
                }
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
