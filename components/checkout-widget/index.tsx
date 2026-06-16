"use client";

import React from 'react';
import { WidgetProvider, useWidgetState } from './context/widget-state';
import { MethodSelector } from './steps/method-selector';
import { InputForm } from './steps/input-form';
import { PaymentStatus } from './steps/payment-status';

// Internal controller that manages the switching logic
function WidgetWizardController() {
  const { step } = useWidgetState();

  switch (step) {
    case 'METHOD_SELECT':
      return <MethodSelector />;
    case 'INPUT_FORM':
      return <InputForm />;
    case 'PROCESSING':
    case 'SUCCESS':
    case 'FAILED':
      return <PaymentStatus />;
    default:
      return <MethodSelector />;
  }
}

interface UnifiedCheckoutWidgetProps {
  amount: number;
  currency: string;
  merchantName: string;
}

// Global Export Entry Component wrapping our isolated state machine engine
export function UnifiedCheckoutWidget({ 
  amount, 
  currency, 
  merchantName 
}: { 
  amount: number; 
  currency: string; 
  merchantName: string; 
}) {
  return (
    <WidgetProvider 
      initialAmount={amount} 
      initialCurrency={currency} 
      merchantName={merchantName}
    >
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-6 transition-all duration-300">
        <WidgetWizardController />
      </div>
    </WidgetProvider>
  );
}
//Nothing Much