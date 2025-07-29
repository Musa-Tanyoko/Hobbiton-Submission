import React from 'react';
import type { StepProps } from '../../types/index';

const DriverStep: React.FC<StepProps> = ({ formData, onUpdate, onNext, onPrevious, currentStep, totalSteps }) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const isStepValid = () => {
    return formData.fullName && formData.age && formData.licenseYears && formData.claims !== undefined;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Driver Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            className="form-input"
            placeholder="Enter your full name"
            value={formData.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            id="age"
            className="form-input"
            placeholder="e.g., 25"
            min="16"
            max="100"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="licenseYears" className="block text-sm font-medium text-gray-700 mb-2">
            Years with License *
          </label>
          <input
            type="number"
            id="licenseYears"
            className="form-input"
            placeholder="e.g., 5"
            min="0"
            max="50"
            value={formData.licenseYears || ''}
            onChange={(e) => handleInputChange('licenseYears', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="claims" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Claims in Last 3 Years *
          </label>
          <input
            type="number"
            id="claims"
            className="form-input"
            placeholder="e.g., 0"
            min="0"
            max="10"
            value={formData.claims || ''}
            onChange={(e) => handleInputChange('claims', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="btn-secondary"
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

export default DriverStep; 