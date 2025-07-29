import React, { useState } from 'react';
import type { StepProps } from '../../types/index';
import { calculateQuote, getPremiumBreakdown } from '../../utils/quoteCalculator';
import Modal from '../Modal';

const QuoteStep: React.FC<StepProps> = ({ formData, onUpdate, onNext, onPrevious, currentStep, totalSteps }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const quote = calculateQuote(formData);
  const breakdown = getPremiumBreakdown(formData);

  const handleContactSupport = () => {
    setShowContactModal(true);
  };

  const handleSaveQuote = () => {
    // This will be handled by the parent component
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Quote</h2>
        <p className="text-gray-600">Review your insurance quote</p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-green-600 mb-2">
            K{quote.toLocaleString()}
          </div>
          <div className="text-gray-600">Annual Premium</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600">Vehicle</div>
            <div className="font-semibold">
              {formData.year} {formData.make} {formData.model}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600">Driver</div>
            <div className="font-semibold">{formData.fullName}</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600">Coverage</div>
            <div className="font-semibold capitalize">
              {formData.coverage?.replace('-', ' ')}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600">Excess</div>
            <div className="font-semibold">K{formData.excess}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowBreakdown(true)}
            className="btn-secondary flex-1"
          >
            View Breakdown
          </button>
          <button
            onClick={handleContactSupport}
            className="btn-secondary flex-1"
          >
            Contact Support
          </button>
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
          onClick={handleSaveQuote}
          className="btn-primary"
        >
          Save Quote
        </button>
      </div>

      {/* Premium Breakdown Modal */}
      <Modal
        isOpen={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        title="Premium Breakdown"
      >
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Base Premium:</span>
            <span className="font-semibold">K{breakdown.basePremium}</span>
          </div>
          <div className="flex justify-between">
            <span>Vehicle Factor:</span>
            <span className={`font-semibold ${breakdown.vehicleFactor >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {breakdown.vehicleFactor >= 0 ? '+' : ''}K{breakdown.vehicleFactor}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Mileage Factor:</span>
            <span className={`font-semibold ${breakdown.mileageFactor >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {breakdown.mileageFactor >= 0 ? '+' : ''}K{breakdown.mileageFactor}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Age Factor:</span>
            <span className={`font-semibold ${breakdown.ageFactor >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {breakdown.ageFactor >= 0 ? '+' : ''}K{breakdown.ageFactor}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Experience Factor:</span>
            <span className={`font-semibold ${breakdown.experienceFactor >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {breakdown.experienceFactor >= 0 ? '+' : ''}K{breakdown.experienceFactor}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Claims Factor:</span>
            <span className={`font-semibold ${breakdown.claimsFactor >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {breakdown.claimsFactor >= 0 ? '+' : ''}K{breakdown.claimsFactor}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Excess Discount:</span>
            <span className={`font-semibold ${breakdown.excessDiscount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {breakdown.excessDiscount >= 0 ? '+' : ''}K{breakdown.excessDiscount}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Coverage Multiplier:</span>
            <span className="font-semibold">×{breakdown.coverageMultiplier}</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Premium:</span>
            <span className="text-green-600">K{breakdown.total.toLocaleString()}</span>
          </div>
        </div>
      </Modal>

      {/* Contact Support Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Support"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with your quote? Our support team is here to assist you.
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Phone:</span>
              <span>+260 211 123 456</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Email:</span>
              <span>support@hobbitoninsurance.com</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Hours:</span>
              <span>Mon-Fri 8AM-6PM</span>
            </div>
          </div>
          <button
            onClick={() => setShowContactModal(false)}
            className="btn-primary w-full"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default QuoteStep; 