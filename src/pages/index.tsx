import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { steps } from '../constants/steps';
import TimelineStep from '../components/TimelineStep';

export default function IndexPage() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const visitedSteps = useRef<Set<number>>(new Set([0]));
  const isUserScrolling = useRef(false); // Evita conflito entre scroll manual e observer

  // Função de scroll ao clicar no número
  const scrollToStep = (index: number) => {
    const el = stepRefs.current[index];
    if (el) {
      isUserScrolling.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveStep(index);
      visitedSteps.current.add(index);

      // Evita observer sobrescrever durante scroll suave
      setTimeout(() => {
        isUserScrolling.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserScrolling.current) return;

        const mostVisibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisibleEntry) {
          const index = Number(mostVisibleEntry.target.getAttribute('data-step'));

          const canAdvance = index > activeStep && visitedSteps.current.has(index - 1);
          const canGoBack = index < activeStep && visitedSteps.current.has(index + 1);
          const isFirstStep = index === 0;

          if (canAdvance || canGoBack || isFirstStep) {
            setActiveStep(index);
            visitedSteps.current.add(index);
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -40% 0px',
      }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [activeStep]);

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pt: 6, pb: 20, position: 'relative' }}>
      {/* Título */}
      <Typography
        variant="h4"
        color="primary.main"
        textAlign="center"
        fontWeight="bold"
        gutterBottom
      >
        Como funciona o Vera AI?
      </Typography>

      {/* Subtítulo */}
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 6 }}
      >
        Uma jornada visual para entender o fluxo de trabalho do sistema.
      </Typography>

      {/* Linha vertical cinza contínua */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 200,
          bottom: 100,
          width: 2,
          bgcolor: 'grey.300',
          transform: 'translateX(-50%)',
          zIndex: 0,
        }}
      />

      {/* Linha azul dinâmica conforme progresso */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 200,
          height: `${(activeStep + 1) * 160}px`, // ajuste conforme altura dos blocos
          width: 2,
          bgcolor: 'primary.main',
          transform: 'translateX(-50%)',
          zIndex: 1,
          transition: 'height 0.3s ease-in-out',
        }}
      />

      {/* Passos da timeline */}
      {steps.map((step, index) => (
        <Box
          key={step.id}
          ref={(el: HTMLDivElement | null) => {
            stepRefs.current[index] = el;
          }}
          data-step={index}
          sx={{
            scrollMarginTop: '120px',
            mb: 10,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <TimelineStep
            step={step}
            index={index}
            isActive={index === activeStep}
            isPast={index < activeStep}
            isLast={index === steps.length - 1}
            onClick={scrollToStep} // <- adiciona clique
          />
        </Box>
      ))}
    </Box>
  );
}
