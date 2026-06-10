"use client";

import React from 'react';
import { useWidgetState } from '../context/widget-state';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

export function PaymentStatus() {
  const { step, paymentMethod, paymentResult, resetWidget, amount, currency } = useWidgetState();

  // 1. Render Loading & STK PIN Interception State
  if (step === 'PROCESSING') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 space-y-4 animate-fade-in">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin stroke-[2.5]" />
        <div className="space-y-1">
          <h3 className="font-extrabold text-gray-800 text-base">Awaiting Authorization</h3>
          <p className="text-xs text-gray-500 max-w-[260px] mx-auto font-medium leading-relaxed">
            We sent an STK Push prompt to your mobile phone. Please enter your SIM PIN to complete the transaction.
          </p>
        </div>
      </div>
    );
  }

  // 2. Render Success Confirmation Frame
  if (step === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 space-y-5 animate-fade-in">
        {/* High Contrast Emerald Green Badge */}
        <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 ring-4 ring-emerald-50/50">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
        
        <div className="space-y-1">
          <h3 className="font-extrabold text-gray-900 text-lg">Payment Successful</h3>
          <p className="text-xs text-gray-400 font-medium">Thank you! Your transaction has been settled cleanly.</p>
        </div>

        {/* Transaction Meta Card Summary */}
        <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs font-medium text-slate-600 space-y-2.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="font-bold text-slate-800">{currency} {amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Method:</span>
            <span className="font-bold text-slate-800">{paymentMethod}</span>
          </div>
          {paymentResult?.gatewayReference && (
            <div className="flex justify-between border-t border-slate-200/60 pt-2.5">
              <span className="text-slate-400">Receipt Ref:</span>
              <span className="font-bold text-emerald-600 uppercase tracking-wider">{paymentResult.gatewayReference}</span>
            </div>
          )}
        </div>

        <button 
          type="button"
          onClick={resetWidget} 
          className="w-full py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors shadow-sm bg-white"
        >
          Close Window
        </button>
      </div>
    );
  }

  // 3. Render Failure / Rejection UI Framework
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 space-y-5 animate-fade-in">
      <div className="p-3 bg-red-50 rounded-full text-red-600 ring-4 ring-red-50/50">
        <XCircle className="w-12 h-12 stroke-[2.5]" />
      </div>

      <div className="space-y-1">
        <h3 className="font-extrabold text-gray-900 text-lg">Transaction Failed</h3>
        <p className="text-xs text-red-500/90 max-w-[260px] mx-auto font-medium leading-relaxed">
          {paymentResult?.message || 'The authorization request was cancelled or timed out by the provider network.'}
        </p>
      </div>

      <button 
        type="button"
        onClick={resetWidget} 
        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
      >
        <RefreshCw className="w-4 h-4 mr-1" />
        <span>Try Another Method</span>
      </button>
    </div>
  );
}