import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import SummarizeOutlined from '@mui/icons-material/SummarizeOutlined';
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined';
import CodeOutlined from '@mui/icons-material/CodeOutlined';

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
    description: 'Fiscais enviam mensalmente documentos obrigatórios diretamente pelo sistema.',
    icon: CloudUploadOutlined,
  },
  {
    id: 2,
    title: 'Validação Automática',
    description: 'Os arquivos são analisados automaticamente com extração de dados como FGTS, INSS, salários etc.',
    icon: CheckCircleOutlined,
  },
  {
    id: 3,
    title: 'Relatórios Gerados',
    description: 'O sistema gera um relatório em PDF com resumo das conformidades e pendências por contrato.',
    icon: SummarizeOutlined,
  },
  {
    id: 4,
    title: 'Validação Manual do Fiscal',
    description: 'O fiscal revisa os resultados, podendo confirmar ou corrigir os dados identificados pela IA.',
    icon: FactCheckOutlined,
  },
  {
    id: 5,
    title: 'Geração de Expressões Regulares',
    description: 'Com base nos documentos anteriores, são criadas expressões para facilitar futuras análises.',
    icon: CodeOutlined,
  },
];
