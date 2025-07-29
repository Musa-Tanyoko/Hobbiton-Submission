import React from 'react';
import type { FormData, SummaryItem } from '../types/index';
import { calculateQuote } from '../utils/quoteCalculator';

interface SummaryPanelProps {
  formData: FormData;
  currentStep: number;
  onStepClick: (step: number) => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ formData, currentStep, onStepClick }) => {
  const getSummaryItems = (): SummaryItem[] => {
    const items: SummaryItem[] = [];

    // Vehicle information
    if (formData.year && formData.make && formData.model) {
      items.push({
        label: 'Vehicle',
        value: `${formData.year} ${formData.make} ${formData.model}`,
        step: 1
      });
    }

    // Driver information
    if (formData.fullName) {
      items.push({
        label: 'Driver',
        value: formData.fullName,
        step: 2
      });
    }

    // Coverage information
    if (formData.coverage) {
      items.push({
        label: 'Coverage',
        value: formData.coverage.charAt(0).toUpperCase() + formData.coverage.slice(1).replace('-', ' '),
        step: 3
      });
    }

    if (formData.excess) {
      items.push({
        label: 'Excess',
        value: `K${formData.excess}`,
        step: 3
      });
    }

    // Quote calculation
    const quote = calculateQuote(formData);
    if (quote > 0) {
      items.push({
        label: 'Estimated Quote',
        value: `K${quote.toLocaleString()}`,
        step: 4
      });
    }

    return items;
  };

  const summaryItems = getSummaryItems();

  if (summaryItems.length === 0 || currentStep <= 1) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 border border-green-200 shadow-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-4">Summary</h3>
      <div className="space-y-3">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
              item.step < currentStep
                ? 'bg-white cursor-pointer hover:bg-green-50 border border-green-200 shadow-sm'
                : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => item.step < currentStep && onStepClick(item.step)}
          >
            <span className="font-medium text-green-700">{item.label}:</span>
            <span className="text-green-900">{item.value}</span>
            {item.step < currentStep && (
              <span className="text-xs text-red-600 ml-2 font-medium">Click to edit</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryPanel; 