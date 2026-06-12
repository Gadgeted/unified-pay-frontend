"use client";

import React, { useState } from 'react';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';
import { DashboardMetrics } from '@/types/gateway';
import { LayoutDashboard, CreditCard, Box, Settings, LogOut, Bell, Search, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  // Mocking data that matches the exact metrics contract populated by our fresh DB schema
  const [mockData] = useState<DashboardMetrics>({
    businessName: "Maina Electronics & Spares",
    metrics: {
      totalGrossVolume: 2450500,
      withdrawableBalance: 1840200,
      platformFeesCollected: 36750,
      totalBusinessExpenses: 0,   // ◄ Added to fix TS error
      totalEmployeeSalaries: 0,
      netBusinessProfit: 1560000,
    },
    transactionCount: 1420,
    channelVolumeDistribution: {
      mpesa: 1470300,  // M-Pesa leading local volume split
      airtel: 294060,
      card: 490100,
      crypto: 196040,
    },
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar Navigation Panel */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800">
        <div className="space-y-8">
          {/* Brand Identity Header */}
          <div className="flex items-center space-x-3 px-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none text-white">UNIFIED PAY</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">GATEWAY CORE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { name: 'Analytics Ledger', icon: <LayoutDashboard className="w-4 h-4" />, active: true },
              { name: 'Payment Streams', icon: <CreditCard className="w-4 h-4" />, active: false },
              { name: 'Ngunyi Inventory', icon: <Box className="w-4 h-4" />, active: false },
              { name: 'Gateway Settings', icon: <Settings className="w-4 h-4" />, active: false },
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                  item.active 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Account Session InfoFooter */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/30">
              ME
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{mockData.businessName}</p>
              <p className="text-[10px] font-medium text-slate-500 truncate">Merchant ID: live_1234</p>
            </div>
          </div>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Disconnect Session</span>
          </button>
        </div>
      </aside>

      {/* Main Control View Workspace */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Application Controls */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200/60 px-3 py-1.5 rounded-xl w-72">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reference tokens..." 
              className="bg-transparent text-xs text-gray-700 outline-none w-full font-medium"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative bg-gray-50 rounded-xl transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-500 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>PostgreSQL Connected</span>
            </span>
          </div>
        </header>

        {/* Scrollable Metrics Content Box */}
        <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Financial Analytics Ledger</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Real-time performance distribution across synchronized multi-channel payment streams.</p>
          </div>

          {/* Render the Metrics Dynamic Grid Layout component */}
          <MetricsGrid data={mockData} />
        </div>
      </main>

    </div>
  );
}