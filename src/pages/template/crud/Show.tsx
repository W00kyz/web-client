import Section from '@components/Section';
import { PageContainer } from '@toolpad/core';

interface ShowTemplatesProps {
  id: string;
}

export const ShowTemplates = ({ id }: ShowTemplatesProps) => {
  return (
    <PageContainer>
      <Section title={`Detalhes do Template ${id}`}>
        {/* TODO: Conteúdo de visualização */}
        Show
      </Section>
    </PageContainer>
  );
};
