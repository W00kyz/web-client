import { Report } from '@datasources/report';
import { Text, StyleSheet } from '@react-pdf/renderer';
import { CustomPage } from '@components/pdf/PDFComponents';

interface Props {
  employees: Report[];
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Raleway',
  },
  text: {
    fontSize: 12,
    marginBottom: 6,
    fontFamily: 'Raleway',
  },
});

export const ReportObservationsPage = ({ employees }: Props) => (
  <CustomPage sectionName="Observações">
    <Text style={styles.title}>Observações</Text>
    {employees.map((e, index) =>
      e.observacao?.trim() ? (
        <Text key={index} style={styles.text}>
          <Text style={{ fontWeight: 'bold' }}>
            {e.nome} (ID {index + 1}):{' '}
          </Text>
          {e.observacao}
        </Text>
      ) : null
    )}
  </CustomPage>
);
