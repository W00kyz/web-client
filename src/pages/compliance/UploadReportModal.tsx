import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadReportForm from './UploadReportForm';
import type { Report, ReportDataSource } from '@datasources/report';

interface UploadReportModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: (report: Report) => void;
  dataSource: ReportDataSource;
}

const UploadReportModal = ({
  open,
  onClose,
  onUploadSuccess,
  dataSource,
}: UploadReportModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Novo Relatório
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <UploadReportForm
          dataSource={dataSource}
          onUploadSuccess={(report) => {
            onClose();
            onUploadSuccess(report);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadReportModal;
