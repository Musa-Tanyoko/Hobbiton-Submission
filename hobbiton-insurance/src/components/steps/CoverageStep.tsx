import React from 'react';
import type { StepProps } from '../../types/index';

const CoverageStep: React.FC<StepProps> = ({ formData, onUpdate, onNext, onPrevious, currentStep, totalSteps }) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const isStepValid = () => {
    return formData.coverage && formData.excess;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Coverage Options</h2>
        <p className="text-gray-600">Choose your coverage level and excess</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Coverage Type *
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-green-500 cursor-pointer">
              <input
                type="radio"
                name="coverage"
                value="comprehensive"
                checked={formData.coverage === 'comprehensive'}
                onChange={(e) => handleInputChange('coverage', e.target.value)}
                className="mr-3 text-green-600 focus:ring-green-500"
              />
              <div>
                <div className="font-semibold text-gray-800">Comprehensive</div>
                <div className="text-sm text-gray-600">Full coverage including damage to your vehicle</div>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-green-500 cursor-pointer">
              <input
                type="radio"
                name="coverage"
                value="third-party-fire-theft"
                checked={formData.coverage === 'third-party-fire-theft'}
                onChange={(e) => handleInputChange('coverage', e.target.value)}
                className="mr-3 text-green-600 focus:ring-green-500"
              />
              <div>
                <div className="font-semibold text-gray-800">Third Party, Fire & Theft</div>
                <div className="text-sm text-gray-600">Covers damage to others, fire, and theft</div>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-green-500 cursor-pointer">
              <input
                type="radio"
                name="coverage"
                value="third-party"
                checked={formData.coverage === 'third-party'}
                onChange={(e) => handleInputChange('coverage', e.target.value)}
                className="mr-3 text-green-600 focus:ring-green-500"
              />
              <div>
                <div className="font-semibold text-gray-800">Third Party Only</div>
                <div className="text-sm text-gray-600">Basic coverage for damage to others</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="excess" className="block text-sm font-medium text-gray-700 mb-2">
            Excess Amount (K) *
          </label>
          <select
            id="excess"
            className="form-select"
            value={formData.excess || ''}
            onChange={(e) => handleInputChange('excess', e.target.value)}
          >
            <option value="">Select Excess</option>
            <option value="250">K250</option>
            <option value="500">K500</option>
            <option value="1000">K1,000</option>
            <option value="1500">K1,500</option>
            <option value="2000">K2,000</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Higher excess means lower premium but more out-of-pocket costs
          </p>
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

export default CoverageStep; 