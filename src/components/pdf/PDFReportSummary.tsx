import { Text, View, StyleSheet, Page } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
  },
  item: {
    marginBottom: 2,
  },
});

const ReportSummary = () => (
  <Page size="A4" style={styles.page}>
    <View style={styles.container}>
      <Text style={styles.title}>Sumário</Text>
      {[
        "Lista de Funcionários",
        "Lista de Substitutos",
        "Cartão de Pontos",
        "Recibos de Entrega",
        "Vale-Transporte",
      ].map((item, i) => (
        <Text key={i} style={styles.item}>
          - {item}
        </Text>
      ))}
    </View>
  </Page>
);

export default ReportSummary;
