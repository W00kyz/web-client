import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { steps } from '../constants/steps';
import TimelineStep from '../components/TimelineStep';
import Lottie from 'lottie-react';
import aiAnimation from '../assets/json/vera-animation.json';
import { Link } from 'react-router-dom';

export default function IndexPage() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const lastStepRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const visitedSteps = useRef<Set<number>>(new Set([0]));
  const isUserScrolling = useRef(false);

  const scrollToStep = (index: number) => {
    const el = stepRefs.current[index];
    if (el) {
      isUserScrolling.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveStep(index);
      visitedSteps.current.add(index);
      setTimeout(() => {
        isUserScrolling.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserScrolling.current) return;
        const mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) {
          const index = Number(mostVisible.target.getAttribute('data-step'));
          const canAdvance = index > activeStep && visitedSteps.current.has(index - 1);
          const canGoBack = index < activeStep && visitedSteps.current.has(index + 1);
          const isFirst = index === 0;

          if (canAdvance || canGoBack || isFirst) {
            setActiveStep(index);
            visitedSteps.current.add(index);
          }
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -40% 0px' }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [activeStep]);

  useEffect(() => {
    const updateLineHeight = () => {
      if (!timelineRef.current || !lastStepRef.current) return;

      const timelineTop = timelineRef.current.getBoundingClientRect().top + window.scrollY;
      const lastStepTop = lastStepRef.current.getBoundingClientRect().top + window.scrollY;

      const height = lastStepTop - timelineTop + 60;
      setLineHeight(height);
    };

    updateLineHeight();
    window.addEventListener('resize', updateLineHeight);
    return () => window.removeEventListener('resize', updateLineHeight);
  }, []);

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pt: 6, pb: 20, position: 'relative' }}>
      {/* Título */}
      <Typography variant="h4" color="primary.main" textAlign="center" fontWeight="bold" gutterBottom>
        Como utilizar o Vera AI?
      </Typography>

      {/* Subtítulo */}
      <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
        Entenda o fluxo de trabalho do sistema!
      </Typography>

      {/* Container da timeline */}
      <Box ref={timelineRef} sx={{ position: 'relative' }}>
        {/* Linha cinza contínua */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 2,
            bottom: 0,
            bgcolor: 'grey.300',
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        />

        {/* Linha azul dinâmica */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 2,
            bottom: 0,
            bgcolor: 'grey.300',
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        />

        {/* Passos */}
        {steps.map((step, index) => (
          <Box
            key={step.id}
            ref={(el: HTMLDivElement | null) => {
              stepRefs.current[index] = el;
              if (index === steps.length - 1) lastStepRef.current = el;
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
              onClick={scrollToStep}
            />
          </Box>
        ))}
      </Box>

      {/* Seção do Vera AI */}
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          textAlign: 'center',
          mt: 10,
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
          O que é o Vera AI?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          O Vera AI é um sistema inteligente desenvolvido para simplificar e automatizar a fiscalização
          de contratos administrativos.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 0 }}>
          A fiscalização de contratos exige uma análise detalhada de diversos documentos e informações, 
          tornando o processo longo e suscetível a erros humanos. Este sistema veio para permitir que fiscais e 
          gestores possam conduzir suas análises de forma mais eficiente.
        </Typography>

        {/* Animação */}
        <Lottie
          animationData={aiAnimation}
          loop
          style={{
            maxWidth: 450,
            margin: '0 auto',
            marginTop: -10,
            display: 'block',
            lineHeight: 0,         
            paddingTop: 0, 
          }}
        />
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Link
          to="/templates"
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 24px',
            fontSize: '1rem',
            borderRadius: '8px',
            display: 'inline-block',
          }}
        >
          Comece já!
        </Link>
      </Box>
    </Box>
  );
}
