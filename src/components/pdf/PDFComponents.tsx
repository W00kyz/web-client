import { Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import UFCG_logo from '@assets/images/UFCG_logo.png';

const styles = StyleSheet.create({
  // Linhas e layout geral
  line: {
    height: 2,
    backgroundColor: '#0b0b68',
    width: '100%',
    marginVertical: 2,
  },
  sectionName: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  logo: {
    width: 50,
    height: 50,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Header
  headerContainer: {
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 10,
  },

  // Footer
  footerContainer: {
    paddingHorizontal: 40,
    paddingTop: 10,
    paddingBottom: 30,
  },

  // Page container
  page: {
    flexDirection: 'column',
    padding: 0,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'flex-start',
  },
});

type HeaderFooterProps = {
  sectionName?: string;
};

export const PDFHeader = ({ sectionName }: HeaderFooterProps) => (
  <View fixed>
    <View style={styles.headerContainer}>
      <View style={styles.top}>
        <Image src={UFCG_logo} style={styles.logo} />
        {sectionName && <Text style={styles.sectionName}>{sectionName}</Text>}
      </View>
      <View style={styles.line} />
      <View style={styles.line} />
      <View style={styles.line} />
    </View>
  </View>
);

export const PDFFooter = () => (
  <View fixed>
    <View style={styles.footerContainer}>
      <View style={styles.line} />
      <View style={styles.line} />
      <View style={styles.line} />
    </View>
  </View>
);

type ReportPageProps = {
  sectionName?: string;
  children: React.ReactNode;
};

export const CustomPage = ({ sectionName, children }: ReportPageProps) => (
  <Page size="A4" style={styles.page}>
    <PDFHeader sectionName={sectionName} />
    <View style={styles.content}>{children}</View>
    <PDFFooter />
  </Page>
);
