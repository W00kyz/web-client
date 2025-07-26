import { Text, StyleSheet, Font } from '@react-pdf/renderer';
import { Report } from '@datasources/report';
import Raleway from '@assets/fonts/Raleway/static/Raleway-Regular.ttf';
import RalewayBold from '@assets/fonts/Raleway/static/Raleway-Bold.ttf';
import { ReportPage } from '../PDFComponents';

Font.register({
  family: 'Raleway',
  fonts: [{ src: Raleway }, { src: RalewayBold, fontWeight: 'bold' }],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Raleway',
    fontSize: 12,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0b0b68',
    textTransform: 'uppercase',
  },
  intro: {
    fontSize: 12,
    marginBottom: 20,
    color: '#333',
  },
  item: {
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    color: '#111',
  },
});

type Summary = {
  totalFuncionarios: number;
  totalSubstitutos: number;
  totalComRecibo: number;
  totalComAssinatura: number;
  totalFGTS: number;
  totalINSS: number;
  totalVT: number;
  totalHoras: number;
  dataInicio: string | null;
  dataFim: string | null;
};

const summarizeReports = (reports: Report[]): Summary => {
  let totalHoras = 0;
  let dataInicio: string | null = null;
  let dataFim: string | null = null;

  reports.forEach((r) => {
    if (r.total_horas) {
      const [h, m] = r.total_horas.split(':').map(Number);
      totalHoras += h * 60 + (m || 0);
    }
    if (!dataInicio || r.data_inicio < dataInicio) dataInicio = r.data_inicio;
    if (!dataFim || r.data_fim > dataFim) dataFim = r.data_fim;
  });

  return {
    totalFuncionarios: reports.length,
    totalSubstitutos: reports.filter((r) => r.substituto).length,
    totalComRecibo: reports.filter((r) => r.tem_recibo).length,
    totalComAssinatura: reports.filter((r) => r.tem_assinatura).length,
    totalFGTS: reports.filter((r) => r.FGTS).length,
    totalINSS: reports.filter((r) => r.INSS).length,
    totalVT: reports.filter((r) => r.VT).length,
    totalHoras,
    dataInicio,
    dataFim,
  };
};

const formatHoras = (minutos: number): string => {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h${m.toString().padStart(2, '0')}m`;
};

type ReportSummaryProps = {
  reports: Report[];
};

const ReportSummary = ({ reports }: ReportSummaryProps) => {
  const summary = summarizeReports(reports);

  return (
    <ReportPage sectionName="Sumário">
      <Text style={styles.intro}>
        Este sumário apresenta os principais dados compilados a partir da lista
        de funcionários analisada. As informações incluem contagens de
        conformidade, substituições, benefícios e período do relatório.
      </Text>

      <Text style={styles.item}>
        <Text style={styles.label}>Total de Funcionários: </Text>
        {summary.totalFuncionarios}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Total de Substitutos: </Text>
        {summary.totalSubstitutos}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Com Recibo: </Text>
        {summary.totalComRecibo}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Com Assinatura: </Text>
        {summary.totalComAssinatura}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Com FGTS: </Text>
        {summary.totalFGTS}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Com INSS: </Text>
        {summary.totalINSS}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Com VT: </Text>
        {summary.totalVT}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Total de Horas: </Text>
        {formatHoras(summary.totalHoras)}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.label}>Período do Relatório: </Text>
        {summary.dataInicio ?? '-'} até {summary.dataFim ?? '-'}
      </Text>
    </ReportPage>
  );
};

export { summarizeReports };
export default ReportSummary;
