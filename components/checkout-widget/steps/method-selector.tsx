"use client";

import React from 'react';
import { useWidgetState } from '../context/widget-state';
import { PaymentMethod } from '@/types/gateway';
import { Smartphone, CreditCard, Coins } from 'lucide-react';

interface ChannelOption {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  brandClass: string;
}

export function MethodSelector() {
  const { amount, currency, merchantName, setPaymentMethod } = useWidgetState();

  const channels: ChannelOption[] = [
    {
      id: 'MPESA',
      title: 'Lipa Na M-Pesa',
      subtitle: 'Safaricom mobile money push',
      icon: <Smartphone className="w-5 h-5 text-mpesa" />,
      brandClass: 'hover:border-mpesa focus:ring-mpesa bg-white',
    },
    {
      id: 'AIRTEL',
      title: 'Airtel Money',
      subtitle: 'Airtel STK merchant prompt',
      icon: <Smartphone className="w-5 h-5 text-airtel" />,
      brandClass: 'hover:border-airtel focus:ring-airtel bg-white',
    },
    {
      id: 'CARD',
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard secure token',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      brandClass: 'hover:border-blue-500 focus:ring-blue-500 bg-white',
    },
    {
      id: 'CRYPTO',
      title: 'Pay with Crypto',
      subtitle: 'USDC over Sepolia Testnet',
      icon: <Coins className="w-5 h-5 text-crypto" />,
      brandClass: 'hover:border-crypto focus:ring-crypto bg-white',
    },
  ];

  return (
    <div className="p-1">
      {/* Merchant Header Branding */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-extrabold text-gray-800 tracking-tight">{merchantName}</h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">Secure Unified Gateway</p>
        <div className="text-3xl font-black text-gray-900 mt-4 tracking-tight">
          <span className="text-sm font-bold text-gray-500 mr-1">{currency}</span>
          {amount.toLocaleString()}
        </div>
      </div>

      {/* Grid Selection System */}
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Select Payment Method</p>
      <div className="grid grid-cols-1 gap-3">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setPaymentMethod(channel.id)}
            className={`flex items-center justify-between p-4 border border-gray-200/80 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md transform active:scale-[0.99] group outline-none ring-2 ring-transparent ${channel.brandClass}`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-gray-50 group-hover:bg-transparent transition-colors duration-200">
                {channel.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{channel.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{channel.subtitle}</p>
              </div>
            </div>
            
            {/* Custom arrow indicator */}
            <div className="text-gray-300 group-hover:text-gray-500 transition-colors duration-200 pr-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}