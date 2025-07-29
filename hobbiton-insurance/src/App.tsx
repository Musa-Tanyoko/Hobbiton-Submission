import React, { useState, useEffect } from 'react';
import type { FormData, QuoteData } from './types/index';
import { signInUser, onAuthChange, saveQuote, getSavedQuotes } from './config/firebase';
import { calculateQuote } from './utils/quoteCalculator';
import VehicleStep from './components/steps/VehicleStep';
import DriverStep from './components/steps/DriverStep';
import CoverageStep from './components/steps/CoverageStep';
import QuoteStep from './components/steps/QuoteStep';
import SummaryPanel from './components/SummaryPanel';
import SavedQuotes from './components/SavedQuotes';
import Modal from './components/Modal';
import hobbitonLogo from './assets/hobbiton-logo.png';

const FORM_VERSION = '1.0.0';
const TOTAL_STEPS = 4;

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<QuoteData[]>([]);
  const [showSavedQuotes, setShowSavedQuotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Firebase auth and load saved data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Sign in user anonymously
        const user = await signInUser();
        if (user) {
          setUserId(user.uid);
          
          // Load saved quotes
          const quotes = await getSavedQuotes(user.uid);
          setSavedQuotes(quotes);
        }

        // Load saved form data from localStorage
        const savedData = localStorage.getItem('insuranceQuote');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.version === FORM_VERSION) {
            setFormData(parsedData.data);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('insuranceQuote', JSON.stringify({
        version: FORM_VERSION,
        data: formData
      }));
    }
  }, [formData]);

  const handleFormUpdate = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleSaveQuote = async () => {
    if (!userId) return;

    const quote = calculateQuote(formData);
    const quoteData: Omit<QuoteData, 'id'> = {
      userId,
      formData,
      quote,
      timestamp: new Date(),
      status: 'saved'
    };

    try {
      const quoteId = await saveQuote(quoteData);
      if (quoteId) {
        // Refresh saved quotes
        const quotes = await getSavedQuotes(userId);
        setSavedQuotes(quotes);
        setShowSavedQuotes(true);
      }
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };

  const handleLoadQuote = (loadedFormData: FormData) => {
    setFormData(loadedFormData);
    setCurrentStep(1);
    setShowSavedQuotes(false);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    // In a real app, you would implement delete functionality
    console.log('Delete quote:', quoteId);
    // For now, just remove from local state
    setSavedQuotes(prev => prev.filter(quote => quote.id !== quoteId));
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      onUpdate: handleFormUpdate,
      onNext: handleNext,
      onPrevious: handlePrevious,
      currentStep,
      totalSteps: TOTAL_STEPS
    };

    switch (currentStep) {
      case 1:
        return <VehicleStep {...stepProps} />;
      case 2:
        return <DriverStep {...stepProps} />;
      case 3:
        return <CoverageStep {...stepProps} />;
      case 4:
        return <QuoteStep {...stepProps} />;
      default:
        return <VehicleStep {...stepProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="logo-container">
            <img src={hobbitonLogo} alt="Hobbiton Insurance" className="h-16 w-auto mb-4" />
          </div>
          <h1 className="logo-text">Hobbiton Insurance</h1>
          <p className="logo-tagline">Motor Insurance Quote Calculator</p>
          {userId && (
            <p className="text-xs text-white/70 mt-2">User ID: {userId}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-white/80">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="card">
              {renderCurrentStep()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SummaryPanel
              formData={formData}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
            
            <div className="text-center">
              <button
                onClick={() => setShowSavedQuotes(true)}
                className="btn-secondary w-full"
              >
                View Saved Quotes
              </button>
            </div>
          </div>
        </div>

        {/* Saved Quotes Modal */}
        <Modal
          isOpen={showSavedQuotes}
          onClose={() => setShowSavedQuotes(false)}
          title="Saved Quotes"
        >
          <SavedQuotes
            savedQuotes={savedQuotes}
            onLoadQuote={handleLoadQuote}
            onDeleteQuote={handleDeleteQuote}
          />
        </Modal>

        {/* Save Quote Modal */}
        <Modal
          isOpen={currentStep === TOTAL_STEPS}
          onClose={() => {}}
          title="Save Your Quote"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Would you like to save this quote for future reference?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSaveQuote}
                className="btn-primary flex-1"
              >
                Save Quote
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary flex-1"
              >
                Start New Quote
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;
