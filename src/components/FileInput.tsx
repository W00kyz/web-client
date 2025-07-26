import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';

interface FileInputProps {
  label: string;
  file: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  file,
  onChange,
  accept = 'image/*',
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    if (onChange) onChange(selectedFile);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onChange) onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Box
      position="relative"
      height={80}
      sx={{
        color: file ? theme.palette.primary.main : '#999999', // texto azul ou cinza
        borderBottom: 4,
        borderColor: file ? '#cccccc' : '#dddddd',
      }}
    >
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        px={2}
        display="flex"
        alignItems="center"
      >
        <TextField
          variant="standard"
          slotProps={{ input: { disableUnderline: true, readOnly: true } }}
          margin="normal"
          fullWidth
          disabled
          label={label}
          value={file?.name || ''}
          sx={{
            '& .MuiFormLabel-root.Mui-disabled': {
              color: '#999999',
            },
            '& .MuiInputBase-input.Mui-disabled': {
              color: file ? theme.palette.primary.main : '#999999',
            },
          }}
        />
        {file && (
          <IconButton
            onClick={handleClear}
            size="medium"
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              color: theme.palette.primary.main,
            }}
            aria-label="clear file"
          >
            <ClearIcon fontSize="medium" />
          </IconButton>
        )}
      </Box>

      <ButtonBase
        component="label"
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          cursor: 'pointer',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        onKeyDown={(e) => {
          if (e.key === ' ' && inputRef.current) {
            e.preventDefault();
            inputRef.current.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={handleChange}
        />
      </ButtonBase>
    </Box>
  );
};

export default FileInput;
