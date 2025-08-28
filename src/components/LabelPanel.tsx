// LabelPanel.tsx
import React, { useRef, useEffect } from 'react';
import {
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  InputBase,
  Tooltip,
  Box,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { TransitionGroup } from 'react-transition-group';
import { useMutation } from '@hooks/useMutation';
import {
  templateRuleDataSource,
  CreatedRule,
  CreateRuleInput,
} from '@datasources/template';
import { useSession } from '@hooks/useSession';

interface Label {
  name: string;
  description: string;
  id: number; // id local
  pattern_id?: number; // id do backend
  sent?: boolean;
}

interface LabelCardProps {
  label: Label;
  loading?: boolean;
  onSend: () => void;
  onRemoveLabel?: () => void;
  onChangeDescription?: (desc: string) => void;
  onChangeName?: (name: string) => void;
  focusName?: boolean;
  isSection?: boolean;
  deleting?: boolean;
}

const LabelCard = ({
  label,
  loading,
  onSend,
  onRemoveLabel,
  onChangeDescription,
  onChangeName,
  focusName,
  isSection,
  deleting,
}: LabelCardProps) => {
  const [expanded, setExpanded] = React.useState(!label.sent);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusName) {
      nameInputRef.current?.focus();
    }
  }, [focusName]);

  useEffect(() => {
    if (label.sent) setExpanded(false);
  }, [label.sent]);

  return (
    <Stack padding={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexGrow={1}
          px={1}
        >
          <InputBase
            value={label.name}
            onChange={(e) => onChangeName?.(e.target.value)}
            inputRef={nameInputRef}
            sx={{ fontWeight: 600 }}
            disabled={label.sent}
          />
          {isSection && <Chip label="Seção" size="small" color="secondary" />}
        </Stack>
        <Stack direction="row">
          {!label.sent && (
            <IconButton
              size="small"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          <IconButton size="small" onClick={onRemoveLabel} disabled={deleting}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={expanded} timeout={300} unmountOnExit>
        <Stack gap={1} marginTop={1}>
          <TextField
            value={label.description}
            onChange={(e) => onChangeDescription?.(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            multiline
            minRows={3}
            placeholder="Descrição do rótulo"
            disabled={label.sent}
          />

          <Button
            color="primary"
            variant="contained"
            onClick={onSend}
            disabled={
              loading ||
              label.sent ||
              !label.description.trim() ||
              !label.name.trim()
            }
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
}

export const LabelPanel = ({
  templateName,
  setTemplateName,
}: LabelPanelProps) => {
  const { session } = useSession();
  const [labels, setLabels] = React.useState<Label[]>([]);
  const [currentSendingLabel, setCurrentSendingLabel] = React.useState<
    string | null
  >(null);
  const nextId = useRef(0);

  const { mutate, isLoading } = useMutation<
    { data: CreateRuleInput; token?: string },
    CreatedRule,
    Error
  >(async ({ data, token }) =>
    templateRuleDataSource.createOne({ data, token })
  );

  const { mutate: mutateDelete, isLoading: isDeleting } = useMutation<
    { id: number; token?: string },
    void,
    Error
  >(async ({ id, token }) => templateRuleDataSource.deleteOne({ id, token }));

  const handleAddLabel = () => {
    if (labels.some((l) => !l.sent)) return;

    const newLabel: Label = {
      name: `Novo Rótulo ${labels.length + 1}`,
      description: '',
      id: nextId.current++,
    };
    setLabels((prev) => [...prev, newLabel]);
  };

  const handleRemoveLabel = (label: Label) => {
    if (label.sent && label.pattern_id) {
      mutateDelete(
        { id: label.pattern_id, token: session?.user.token },
        {
          onSuccess: () =>
            setLabels((prev) => prev.filter((l) => l.id !== label.id)),
        }
      );
    } else {
      setLabels((prev) => prev.filter((l) => l.id !== label.id));
    }
  };

  const handleChangeDescription = (id: number, desc: string) => {
    setLabels((prev) =>
      prev.map((l) => (l.id === id ? { ...l, description: desc } : l))
    );
  };

  const handleChangeName = (id: number, name: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
  };

  const handleSendLabel = async (label: Label, isSection?: boolean) => {
    setCurrentSendingLabel(label.name);

    const formattedData = {
      templateId: 1,
      isSection: isSection ?? false,
      name: label.name,
      description: label.description,
    };

    await mutate(
      { data: formattedData, token: session?.user.token },
      {
        onError: () => setCurrentSendingLabel(null),
        onSuccess: (data) => {
          setCurrentSendingLabel(null);
          setLabels((prev) =>
            prev.map((l) =>
              l.id === label.id ? { ...l, sent: true, pattern_id: data.id } : l
            )
          );
        },
      }
    );
  };

  const hasPendingLabel = labels.some((l) => !l.sent);

  return (
    <Paper variant="outlined" sx={{ minWidth: 300 }}>
      <Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          marginX={2}
          marginY={labels.length > 0 ? 0 : 1}
        >
          <Tooltip title="Rótulos são nomes para identificar dados relacionados, cada rótulo possui uma descrição.">
            <InfoIcon style={{ cursor: 'pointer' }} />
          </Tooltip>
          <InputBase
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Digite o nome do template"
            fullWidth
          />
        </Stack>

        {labels.length > 0 && <Divider sx={{ my: 1 }} />}

        <TransitionGroup>
          {labels.map((label, index) => (
            <Collapse key={label.id} timeout={300}>
              <LabelCard
                label={label}
                isSection={index === 0}
                loading={isLoading && currentSendingLabel === label.name}
                deleting={isDeleting && label.sent}
                onSend={() => handleSendLabel(label, index === 0)}
                onRemoveLabel={() => handleRemoveLabel(label)}
                onChangeDescription={(desc) =>
                  handleChangeDescription(label.id, desc)
                }
                onChangeName={(name) => handleChangeName(label.id, name)}
                focusName={
                  label.description === '' && index === labels.length - 1
                }
              />
              {index < labels.length - 1 && <Divider sx={{ my: 1 }} />}
            </Collapse>
          ))}
        </TransitionGroup>

        <Divider sx={{ my: 1, marginBottom: 0 }} />

        <Box
          onClick={handleAddLabel}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: hasPendingLabel ? 'not-allowed' : 'pointer',
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: hasPendingLabel ? 'inherit' : 'action.hover',
            },
            opacity: hasPendingLabel ? 0.5 : 1,
          }}
        >
          <Typography color="primary">Adicionar Rótulo</Typography>
          <AddIcon color="primary" />
        </Box>
      </Stack>
    </Paper>
  );
};
