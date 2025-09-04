// LabelExampleContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ExampleItem = string;

export interface LabelData {
  examples: ExampleItem[];
}

export interface LabelsState {
  [label: string]: LabelData;
}

interface LabelExampleContextType {
  labels: LabelsState;
  addOrUpdateLabel: (label: string, example: ExampleItem) => void;
  removeExample: (label: string, index: number) => void;
  removeLabel: (label: string) => void;
}

const LabelExampleContext = createContext<LabelExampleContextType | undefined>(
  undefined
);

export function LabelExampleProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<LabelsState>({});

  const addOrUpdateLabel = (label: string, example: ExampleItem) => {
    setLabels((prev) => {
      const current = prev[label]?.examples || [];
      return {
        ...prev,
        [label]: { examples: [...current, example] },
      };
    });
  };

  const removeExample = (label: string, index: number) => {
    setLabels((prev) => {
      if (!prev[label]) return prev;
      const newExamples = [...prev[label].examples];
      newExamples.splice(index, 1);
      if (newExamples.length === 0) {
        const { [label]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [label]: { examples: newExamples },
      };
    });
  };

  const removeLabel = (label: string) => {
    setLabels((prev) => {
      const { [label]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <LabelExampleContext.Provider
      value={{ labels, addOrUpdateLabel, removeExample, removeLabel }}
    >
      {children}
    </LabelExampleContext.Provider>
  );
}

export function useLabelExampleContext() {
  const ctx = useContext(LabelExampleContext);
  if (!ctx)
    throw new Error(
      'useLabelExampleContext must be used inside LabelExampleProvider'
    );
  return ctx;
}
