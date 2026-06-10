"use client";

import { useState } from 'react';
import { useWidgetState } from '../context/widget-state';
import { CreatePaymentDto, PaymentResponse } from '@/types/gateway';

export function usePaymentApi() {
  const { amount, currency, paymentMethod, customerIdentifier, setPaymentResult, setStep } = useWidgetState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async () => {
    if (!paymentMethod || !customerIdentifier) {
      setError('Missing payment channel parameters.');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('PROCESSING');

    try {
      const payload: CreatePaymentDto = {
        amount,
        currency,
        paymentMethod,
        customerIdentifier,
        merchantReference: `INV-${Date.now().toString().slice(-6)}`,
        isSandbox: false, 
      };

      const response = await fetch('http://localhost:3000/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'tg_live_secret_key_abc123' 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gateway Error Status: ${response.status}`);
      }

      const data: PaymentResponse = await response.json();
      setPaymentResult(data);
      
      if (data.status === 'SUCCESS' || data.checkoutRequestId) {
        setStep('SUCCESS');
      } else {
        setStep('FAILED');
      }

    } catch (err: any) {
      setError(err.message || 'Network gateway timeout occurred.');
      setStep('FAILED');
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error };
}