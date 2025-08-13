import { useEffect, useRef, useState } from 'react';
import TimelineStep from './TimelineStep';
import { steps } from '../constants/steps';

export default function Timeline() {
  const [activeStep, setActiveStep] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const index = Number(visible.target.getAttribute('data-step-index'));
          setActiveStep(index);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -40% 0px',
        threshold: 0.5,
      }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {steps.map((step, index) => (
        <div
          key={index}
          ref={(el) => (refs.current[index] = el)}
          data-step-index={index}
          style={{ scrollMarginTop: '120px' }}
        >
          <TimelineStep
            step={step}
            index={index}
            isActive={index === activeStep}
            isPast={index < activeStep}
            isLast={index === steps.length - 1}
          />
        </div>
      ))}
    </>
  );
}
