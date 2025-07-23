import { Document, Page, StyleSheet, Text } from "@react-pdf/renderer";
import ReportCover from "./PDFReportCover";
import ReportSummary from "./PDFReportSummary";
import { Table } from "./PDFTable";

const headers = [
  "ID",
  "Nome",
  "Situação",
  "Subst.",
  "Recibo",
  "Assin.",
  "FGTS",
  "INSS",
  "VT",
];

interface Employee {
  nome: string;
  situacao: string;
  substituto: boolean;
  tem_recibo: boolean;
  tem_assinatura: boolean;
  observacao: string;
  FGTS: boolean;
  INSS: boolean;
  VT: boolean;
  total_horas: string;
  data_inicio: string;
  data_fim: string;
  id?: number; // opcional, se não vier do backend
}

interface PdfReportProps {
  employees: Employee[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 40,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 6,
  },
});

const PdfReport = ({ employees }: PdfReportProps) => {
  const fields = headers.map((name) => {
    const width = name === "Nome" || name === "Situação" ? 100 : 40;
    return { name, width };
  });

  const rows = employees.map((e, index) => ({
    ID: index + 1,
    Nome: e.nome,
    Situação: e.situacao,
    "Subst.": e.substituto ? "Sim" : "Não",
    Recibo: e.tem_recibo ? "Sim" : "Não",
    "Assin.": e.tem_assinatura ? "Sim" : "Não",
    FGTS: e.FGTS ? "Sim" : "Não",
    INSS: e.INSS ? "Sim" : "Não",
    VT: e.VT ? "Sim" : "Não",
  }));

  const hasObservations = employees.some((e) => e.observacao?.trim());

  return (
    <Document>
      <ReportCover />
      <ReportSummary />
      <Page size="A4" style={styles.page}>
        <Table fields={fields} rows={rows} />
      </Page>
      {hasObservations && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Observações</Text>
          {employees.map((e, index) =>
            e.observacao?.trim() ? (
              <Text key={index} style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>
                  {e.nome} (ID {index + 1}):{" "}
                </Text>
                {e.observacao}
              </Text>
            ) : null
          )}
        </Page>
      )}
    </Document>
  );
};

export default PdfReport;
