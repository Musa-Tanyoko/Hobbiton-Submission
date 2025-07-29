import React from 'react';
import type { QuoteData, FormData } from '../types/index';

interface SavedQuotesProps {
  savedQuotes: QuoteData[];
  onLoadQuote: (formData: FormData) => void;
  onDeleteQuote: (quoteId: string) => void;
}

const SavedQuotes: React.FC<SavedQuotesProps> = ({ savedQuotes, onLoadQuote, onDeleteQuote }) => {
  if (savedQuotes.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Saved Quotes</h3>
        <p className="text-gray-600">No saved quotes yet. Complete a quote to save it here.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Quotes</h3>
      <div className="space-y-4">
        {savedQuotes.map((quote) => (
          <div key={quote.id} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-gray-800">
                  {quote.formData.year} {quote.formData.make} {quote.formData.model}
                </div>
                <div className="text-sm text-gray-600">
                  {quote.formData.fullName} • {quote.formData.coverage?.replace('-', ' ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  K{quote.quote.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {quote.timestamp.toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onLoadQuote(quote.formData)}
                className="btn-primary text-sm py-2 px-4"
              >
                Load Quote
              </button>
              <button
                onClick={() => quote.id && onDeleteQuote(quote.id)}
                className="btn-secondary text-sm py-2 px-4"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedQuotes; 