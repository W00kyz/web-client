import { Box, Typography, Stack } from '@mui/material';
import { Step } from '../constants/steps';

interface Props {
  step: Step;
  index: number;
  isActive: boolean;
  isLast: boolean;
  isPast: boolean;
  onClick?: (index: number) => void; // <- nova prop para clique
}

export default function TimelineStep({ step, index, isActive, isLast, isPast, onClick }: Props) {
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <Box id={`step-${index}`} sx={{ position: 'relative', maxHeight: 100, scrollMarginTop: 120 }}>
      {/* Conteúdo */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, md: 6 },
          mt: 2,
          flexDirection: isEven ? 'row' : 'row-reverse',
        }}
      >
        {/* Ícone */}
        <Box
          sx={{
            width: '45%',
            display: 'flex',
            justifyContent: isEven ? 'flex-end' : 'flex-start',
          }}
        >
          <Icon sx={{ fontSize: 100, color: isActive ? 'primary.main' : 'grey.300' }} />
        </Box>

        {/* Texto + número */}
        <Box sx={{ width: '45%', textAlign: isEven ? 'left' : 'right' }}>
          {/* Número clicável */}
          <Box
            onClick={() => onClick?.(index)}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              mb: 2,
              ml: isEven ? 0 : 'auto',
              mr: isEven ? 'auto' : 0,
              cursor: 'pointer',
              transition: '0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
              },
            }}
          >
            {index + 1}
          </Box>

          <Typography fontWeight="600" color="black" mb={1}>
            {step.title}
          </Typography>
          <Typography color="text.secondary">{step.description}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
