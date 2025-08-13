import Section from '@components/Section';
import { Button } from '@mui/material';
import { PageContainer } from '@toolpad/core';

interface EditTemplatesProps {
  id: string;
  onEdit: () => void;
}

export const EditTemplates = ({ id, onEdit }: EditTemplatesProps) => {
  return (
    <PageContainer>
      <Section title={`Editar Template ${id}`}>
        <Button variant="contained" onClick={onEdit}>
          Salvar e Voltar
        </Button>
      </Section>
    </PageContainer>
  );
};
