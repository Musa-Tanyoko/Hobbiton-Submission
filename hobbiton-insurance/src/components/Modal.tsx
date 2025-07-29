import React from 'react';
import type { ModalProps } from '../types/index';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-green-200">
        <div className="p-6">
          {title && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-800">{title}</h2>
              <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 