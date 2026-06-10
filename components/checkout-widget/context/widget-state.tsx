"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentMethod, PaymentResponse } from '@/types/gateway';

// Define the steps of our payment processing wizard
export type WidgetStep = 'METHOD_SELECT' | 'INPUT_FORM' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

interface WidgetContextType {
  step: WidgetStep;
  amount: number;
  currency: string;
  merchantName: string;
  paymentMethod: PaymentMethod | null;
  customerIdentifier: string;
  paymentResult: PaymentResponse | null;
  setStep: (step: WidgetStep) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCustomerIdentifier: (value: string) => void;
  setPaymentResult: (result: PaymentResponse | null) => void;
  resetWidget: () => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function WidgetProvider({ 
  children, 
  initialAmount, 
  initialCurrency, 
  merchantName 
}: { 
  children: ReactNode;
  initialAmount: number;
  initialCurrency: string;
  merchantName: string;
}) {
  const [step, setStep] = useState<WidgetStep>('METHOD_SELECT');
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod | null>(null);
  const [customerIdentifier, setCustomerIdentifier] = useState<string>('');
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);

  const setPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethodState(method);
    setStep('INPUT_FORM'); // Move instantly to data entry when a channel is chosen
  };

  const resetWidget = () => {
    setStep('METHOD_SELECT');
    setPaymentMethodState(null);
    setCustomerIdentifier('');
    setPaymentResult(null);
  };

  return (
    <WidgetContext.Provider value={{
      step,
      amount: initialAmount,
      currency: initialCurrency,
      merchantName,
      paymentMethod,
      customerIdentifier,
      paymentResult,
      setStep,
      setPaymentMethod,
      setCustomerIdentifier,
      setPaymentResult,
      resetWidget
    }}>
      {children}
    </WidgetContext.Provider>
  );
}

// Custom hook for isolated state access across checkout views
export function useWidgetState() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgetState must be executed inside a <WidgetProvider /> wrapper.');
  }
  return context;
}