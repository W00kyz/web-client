import FilePresentOutlined from '@mui/icons-material/FilePresentOutlined';
import HighlightAltOutlined from '@mui/icons-material/HighlightAltOutlined';
import PlaylistAddCheckOutlined from '@mui/icons-material/PlaylistAddCheckOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import PersonSearchOutlined from '@mui/icons-material/PersonSearchOutlined';

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const steps: Step[] = [
  {
    id: 1,
    title: 'Upload de Documentos',
    description: 'Na página templates selecione o(s) documento(s) a serem analisados.',
    icon: FilePresentOutlined,
  },
  {
    id: 2,
    title: 'Seleção da Análise',
    description: 'Selecione a seção a ser analisada nos documentos.',
    icon: HighlightAltOutlined,
  },
  {
    id: 3,
    title: 'Confirmação de seleção',
    description: 'Analise se a seção selecionada é a desejada e confirme para a geração automática do relatório.',
    icon: PlaylistAddCheckOutlined,
  },
  {
    id: 4,
    title: 'Relatório Gerado',
    description: 'O sistema gera um relatório em PDF com resumo das conformidades e pendências por contrato.',
    icon: DescriptionOutlined,
  },
  {
    id: 5,
    title: 'Validação Manual do Fiscal',
    description: 'O fiscal revisa os resultados, podendo confirmar ou corrigir os dados identificados.',
    icon: PersonSearchOutlined,
  },
];
