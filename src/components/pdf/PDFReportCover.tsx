import { Text, View, StyleSheet, Page } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
  },
});

const ReportCover = () => (
  <Page size="A4" style={styles.page}>
    <View style={styles.container}>
      <Text style={styles.title}>Relatório de Conformidade</Text>
      <Text style={styles.subtitle}>Empresa Exemplo S/A</Text>
      <Text style={styles.subtitle}>Julho de 2025</Text>
    </View>
  </Page>
);

export default ReportCover;
