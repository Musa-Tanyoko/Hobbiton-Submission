export interface FormData {
  // Vehicle Information
  year?: string;
  make?: string;
  model?: string;
  mileage?: string;
  
  // Driver Information
  fullName?: string;
  age?: string;
  licenseYears?: string;
  claims?: string;
  
  // Coverage Information
  coverage?: string;
  excess?: string;
  
  // Additional Information
  address?: string;
  phone?: string;
  email?: string;
}

export interface QuoteData {
  id?: string;
  userId: string;
  formData: FormData;
  quote: number;
  timestamp: Date;
  status: 'draft' | 'saved' | 'submitted';
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export interface StepProps {
  formData: FormData;
  onUpdate: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export interface SummaryItem {
  label: string;
  value: string;
  step: number;
} 