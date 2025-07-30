import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Document } from '@react-pdf/renderer';
import { PDFPreview } from './PDFPreview';

interface PdfModalProps {
  open: boolean;
  onClose: () => void;
  document: React.ReactElement<typeof Document>;
}

const styleModal = {
  position: 'fixed' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};

const PdfModal = ({ open, onClose, document }: PdfModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleModal}>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <PDFPreview document={document} />
        </Box>
      </Box>
    </Modal>
  );
};

export default PdfModal;
