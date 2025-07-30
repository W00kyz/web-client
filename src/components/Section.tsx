import { Paper, Typography, Box, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState, ReactNode } from 'react';

interface SectionProps {
  title?: string;
  children: ReactNode;
  defaultCollapsed?: boolean;
}

const Section = ({
  title,
  children,
  defaultCollapsed = false,
}: SectionProps) => {
  const [open, setOpen] = useState(!defaultCollapsed);

  const handleToggle = () => setOpen((o) => !o);

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggle();
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, mb: 3, cursor: 'pointer', userSelect: 'none' }}
      onClick={handleToggle}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: '100%',
          justifyContent: title ? 'space-between' : 'flex-end',
        }}
      >
        {title && (
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        )}
        <IconButton onClick={handleIconClick}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={open} onClick={(e) => e.stopPropagation()}>
        <Box mt={2}>{children}</Box>
      </Collapse>
    </Paper>
  );
};

export default Section;
