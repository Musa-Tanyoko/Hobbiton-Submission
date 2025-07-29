import React, { useState, useEffect } from 'react';
import type { StepProps } from '../../types/index';

const VehicleStep: React.FC<StepProps> = ({ formData, onUpdate, onNext, onPrevious, currentStep, totalSteps }) => {
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    // Generate years from current year back to 1990
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear; year >= 1990; year--) {
      yearOptions.push(year);
    }
    setYears(yearOptions);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const isStepValid = () => {
    return formData.year && formData.make && formData.model && formData.mileage;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-2">Vehicle Information</h2>
        <p className="text-green-600">Tell us about your vehicle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-green-700 mb-2">
            Vehicle Year *
          </label>
          <select
            id="year"
            className="form-select"
            value={formData.year || ''}
            onChange={(e) => handleInputChange('year', e.target.value)}
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="make" className="block text-sm font-medium text-green-700 mb-2">
            Make *
          </label>
          <input
            type="text"
            id="make"
            className="form-input"
            placeholder="e.g., Toyota, Honda"
            value={formData.make || ''}
            onChange={(e) => handleInputChange('make', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-green-700 mb-2">
            Model *
          </label>
          <input
            type="text"
            id="model"
            className="form-input"
            placeholder="e.g., Corolla, Civic"
            value={formData.model || ''}
            onChange={(e) => handleInputChange('model', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-green-700 mb-2">
            Annual Mileage *
          </label>
          <input
            type="number"
            id="mileage"
            className="form-input"
            placeholder="e.g., 15000"
            value={formData.mileage || ''}
            onChange={(e) => handleInputChange('mileage', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="btn-secondary"
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="btn-primary"
          disabled={!isStepValid()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VehicleStep; 