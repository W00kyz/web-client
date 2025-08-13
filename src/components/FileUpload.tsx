import { FC } from 'react';
import { Button, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export const FileUpload: FC<FileUploadProps> = ({ file, onChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onChange(selectedFile);
  };

  const handleClearFile = () => {
    onChange(null);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor="#f9f9fc"
      borderRadius="6px"
      overflow="hidden"
      border="1px solid #ccc"
      sx={{ pr: 1, width: '100%' }}
    >
      <input
        type="file"
        accept="application/pdf"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          sx={{
            bgcolor: '#6750A4',
            '&:hover': { bgcolor: '#6750A4' },
            textTransform: 'none',
            borderRadius: 0,
          }}
        >
          Selecionar PDF
        </Button>
      </label>
      <Typography
        sx={{
          ml: 2,
          color: '#333',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {file?.name || 'Nenhum arquivo selecionado'}
      </Typography>

      {file && (
        <IconButton size="small" onClick={handleClearFile}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
