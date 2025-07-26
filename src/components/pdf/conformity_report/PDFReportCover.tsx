import { Text, View, StyleSheet, Page, Image, Font } from '@react-pdf/renderer';
import pdf_cover from '@assets/images/pdf_cover.png';
import UFCG_logo from '@assets/images/UFCG_logo.png';
import Raleway from '@assets/fonts/Raleway/static/Raleway-Regular.ttf';
import RalewayBold from '@assets/fonts/Raleway/static/Raleway-Bold.ttf';

Font.register({
  family: 'Raleway',
  fonts: [{ src: Raleway }, { src: RalewayBold, fontWeight: 'bold' }],
});

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  logo: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 80,
    height: 80,
  },
  container: {
    height: '100%',
    width: '100%',
    paddingTop: 450,
    marginLeft: -50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'black',
    fontFamily: 'Raleway',
    textAlign: 'left',
  },
  titleWrapper: {
    width: 350,
  },
  title: {
    fontSize: 38,
    color: '#0b0b68',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    lineHeight: 1.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 10,
  },
});

type ReportCoverProps = {
  title: string;
  companyName: string;
  date: string;
};

const ReportCover = ({ title, companyName, date }: ReportCoverProps) => (
  <Page size="A4">
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.subtitle}>{companyName}</Text>
      <Text style={styles.subtitle}>{date}</Text>
    </View>
    <Image src={UFCG_logo} style={styles.logo} />
    <Image src={pdf_cover} style={styles.background} />
  </Page>
);

export default ReportCover;
