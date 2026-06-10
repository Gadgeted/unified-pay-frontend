"use client";

import React, { useState } from 'react';
import { useWidgetState } from '../context/widget-state';
import { usePaymentApi } from '../hooks/use-payment-api';
import { ArrowLeft, Phone, CreditCard, Wallet } from 'lucide-react';

export function InputForm() {
  const { paymentMethod, customerIdentifier, setCustomerIdentifier, setStep, amount, currency } = useWidgetState();
  const { initiatePayment, loading, error } = usePaymentApi();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!customerIdentifier.trim()) {
      setLocalError('This input field is required to proceed.');
      return;
    }

    if ((paymentMethod === 'MPESA' || paymentMethod === 'AIRTEL') && customerIdentifier.length < 9) {
      setLocalError('Please enter a valid mobile network phone number.');
      return;
    }

    initiatePayment();
  };

  return (
    <div>
      {/* Back Navigation Header */}
      <button 
        type="button"
        onClick={() => setStep('METHOD_SELECT')}
        className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors mb-5 group outline-none"
      >
        <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
        <span>CHANGE METHOD</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Render Mobile Money Layout Blocks */}
        {(paymentMethod === 'MPESA' || paymentMethod === 'AIRTEL') && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              {paymentMethod === 'MPESA' ? 'M-Pesa Number' : 'Airtel Money Number'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="e.g. 254712345678"
                value={customerIdentifier}
                onChange={(e) => setCustomerIdentifier(e.target.value.replace(/\s+/g, ''))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm tracking-wide text-gray-800 transition-all shadow-sm"
                disabled={loading}
              />
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              Enter your number to receive a secure STK Push PIN prompt on your phone.
            </p>
          </div>
        )}

        {/* Render Credit / Debit Card Input Stubs */}
        {paymentMethod === 'CARD' && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Card Token Reference / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="customer@domain.com"
                value={customerIdentifier}
                onChange={(e) => setCustomerIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-gray-800 shadow-sm"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Render Crypto Setup Input Fields */}
        {paymentMethod === 'CRYPTO' && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Your Web3 Payer Wallet Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Wallet className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="0x..."
                value={customerIdentifier}
                onChange={(e) => setCustomerIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-xs text-gray-800 shadow-sm"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Interface Validation Message Frameworks */}
        {(localError || error) && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium leading-relaxed">
            {localError || error}
          </div>
        )}

        {/* Adaptive Dynamic Submit Payment CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 shadow-md transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${
            paymentMethod === 'MPESA' 
              ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500' 
              : paymentMethod === 'AIRTEL' 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500' 
              : paymentMethod === 'CRYPTO'
              ? 'bg-amber-500 hover:bg-amber-600 focus:ring-2 focus:ring-amber-400'
              : 'bg-slate-900 hover:bg-slate-800 focus:ring-2 focus:ring-slate-900'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Initiating Connection...</span>
            </span>
          ) : (
            `Pay ${currency} ${amount.toLocaleString()}`
          )}
        </button>
      </form>
    </div>
  );
}