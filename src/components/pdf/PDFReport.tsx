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
  id: number;
  nome: string;
  situacao: string;
  substituto: boolean;
  recibo: boolean;
  assinatura: boolean;
  fgts: boolean;
  inss: boolean;
  vt: boolean;
  observacao: string;
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

  const rows = employees.map((e) => ({
    ID: e.id,
    Nome: e.nome,
    Situação: e.situacao,
    "Subst.": e.substituto ? "Sim" : "Não",
    Recibo: e.recibo ? "Sim" : "Não",
    "Assin.": e.assinatura ? "Sim" : "Não",
    FGTS: e.fgts ? "Sim" : "Não",
    INSS: e.inss ? "Sim" : "Não",
    VT: e.vt ? "Sim" : "Não",
  }));

  const hasObservations = employees.some((e) => e.observacao?.trim());

  return (
    <Document>
      <ReportCover />
      <ReportSummary />
      <Page size={"A4"} style={styles.page}>
        <Table fields={fields} rows={rows} />
      </Page>
      {hasObservations && (
        <Page size={"A4"} style={styles.page}>
          <Text style={styles.title}>Observações</Text>
          {employees.map((e) =>
            e.observacao?.trim() ? (
              <Text key={e.id} style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>
                  {e.nome} (ID {e.id}):{" "}
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
