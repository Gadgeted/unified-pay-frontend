"use client";

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ShieldCheck, LayoutDashboard, CreditCard, Box, Settings, LogOut, 
  Search, Bell, RefreshCw, DollarSign, Percent, TrendingUp, 
  CheckCircle2, XCircle, AlertCircle, X, ShoppingBag, Clock, Building, Hash, Smartphone
} from 'lucide-react';
import GatewaySettings from './GatewaySettings';

const MerchantDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('analytics'); // options: 'analytics' | 'settings'
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const rootUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;
      const apiKey = process.env.NEXT_PUBLIC_MERCHANT_API_KEY;

      if (!rootUrl || !apiKey) {
        throw new Error("Gateway environment properties are missing. Update your .env.local file configuration.");
      }

      const cleanUrl = rootUrl.replace(/\/+$/, '');
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      };

      const [analyticsRes, transactionsRes] = await Promise.all([
        fetch(`${cleanUrl}/analytics/dashboard`, { headers }),
        fetch(`${cleanUrl}/analytics/recent-transactions?limit=100`, { headers })
      ]);

      if (!analyticsRes.ok || !transactionsRes.ok) {
        throw new Error("Failed to clear network operations with the database backend.");
      }

      const analyticsData = await analyticsRes.json();
      const transactionsData = await transactionsRes.json();

      setAnalytics(analyticsData);
      setTransactions(transactionsData);
      setError(null);
    } catch (err) {
      console.error("Dashboard engine alignment error:", err);
      setError(err.message);
    } finally {
      loading && setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  // Filter transaction records instantly based on the top reference search string
  const filteredTransactions = transactions.filter(tx => 
    (tx.merchantReference && tx.merchantReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (tx.customerIdentifier && tx.customerIdentifier.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-slate-400 font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-700 border-t-blue-500"></div>
          <p className="text-xs font-bold tracking-widest text-slate-500 animate-pulse">SYNCHRONIZING SECURE GATEWAY INFRASTRUCTURE...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-red-100 shadow-xl shadow-red-500/5 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-900 mb-2">Ledger Synchronization Exception</h3>
          <p className="text-xs font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100/50 mb-6 text-left overflow-x-auto">{error}</p>
          <button onClick={fetchDashboardData} className="w-full py-3 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 hover:bg-red-700 transition-all">
            Retry System Handshake
          </button>
        </div>
      </div>
    );
  }

  const { metrics, chartData } = analytics;

  // Safe JSON extraction for itemized items embedded inside transactions
  const parseItemizedPayload = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    try {
      return typeof payload === 'string' ? JSON.parse(payload) : [];
    } catch (e) {
      console.error("Itemized item array extraction failure:", e);
      return [];
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* 1. SIDEBAR NAVIGATION PANEL */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800 shrink-0">
        <div className="space-y-8">
          
          {/* Brand Identity Header */}
          <div className="flex items-center space-x-3 px-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
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
              { id: 'analytics', name: 'Analytics Ledger', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'streams', name: 'Payment Streams', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'inventory', name: 'Ngunyi Inventory', icon: <Box className="w-4 h-4" /> },
              { id: 'settings', name: 'Gateway Settings', icon: <Settings className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'analytics' || item.id === 'settings') {
                    setCurrentView(item.id);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                  currentView === item.id 
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

        {/* User Session InfoFooter */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/30">
              CM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">Collins Maina Ngunyi</p>
              <p className="text-[10px] font-bold text-slate-500 truncate">Merchant ID: ngunyi_shop</p>
            </div>
          </div>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Disconnect Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Controls */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200/60 px-3 py-1.5 rounded-xl w-72 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reference tokens or phones..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-gray-700 outline-none w-full font-medium"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all border border-gray-100"
              title="Refresh ledger streams"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 relative bg-gray-50 rounded-xl transition-colors border border-gray-100">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-500 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full flex items-center space-x-1.5 border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>PostgreSQL Live</span>
            </span>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* VIEW 1: FINANCIAL ANALYTICS LEDGER */}
          {currentView === 'analytics' && (
            <>
              {/* Welcome Intro Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Financial Analytics Ledger</h2>
                  <p className="text-xs text-gray-400 mt-1 font-medium">Real-time settlement processing across synchronized transactional channel streams.</p>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-white border border-gray-200 shadow-sm px-4 py-2.5 rounded-xl self-start md:self-auto">
                  System Time: <span className="text-slate-800 font-black">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Metrics Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CARD 1: GROSS REVENUE CHANNELS */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm shadow-slate-100/40 relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Gross Volume</span>
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100"><DollarSign className="w-5 h-5" /></div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ksh {metrics.totalGrossVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  <div className="mt-3 flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Active transactional collection flowing</span>
                  </div>
                </div>

                {/* CARD 2: BALANCED PLATFORM FEES */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm shadow-slate-100/40 relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Gateway Fees</span>
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100"><TrendingUp className="w-5 h-5" /></div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ksh {metrics.totalFeesCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  <div className="mt-3 text-[11px] font-bold text-slate-500">
                    Net Internal Payout: <span className="text-slate-800 font-extrabold">Ksh {metrics.totalNetPayout.toLocaleString()}</span>
                  </div>
                </div>

                {/* CARD 3: CONVERSION SYSTEM HEALTH */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm shadow-slate-100/40 relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Success Conversion</span>
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-100"><Percent className="w-5 h-5" /></div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{metrics.successRate}%</h3>
                  <div className="mt-3 text-[11px] font-bold text-blue-600">
                    {metrics.successfulTransactions} successful <span className="text-slate-400 font-medium">out of {metrics.successfulTransactions + metrics.failedTransactions} requests</span>
                  </div>
                </div>

              </div>

              {/* Graph & Log Registry Split Container */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* AREA TIME SERIES TREND VIEW (2/3 Width) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight">Processing Metrics Trend</h4>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Rolling time-series calculations across active periods</p>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">M-PESA CHANNEL</span>
                  </div>
                  <div className="w-full h-72">
                    {chartData.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        No historical volume spikes logged over recent periods.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorVolumeLive" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
                          <Tooltip 
                            formatter={(value) => [`Ksh ${value.toLocaleString()}`, 'Processed']} 
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}
                            itemStyle={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVolumeLive)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* CHANNEL ENGINE QUICK STATS SPLIT (1/3 Width) */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between h-full lg:min-h-[380px]">
                  <div>
                    <h4 className="text-sm font-black tracking-tight mb-1">Channel Splits</h4>
                    <p className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Volume Contribution Index</p>
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-300">Safaricom M-Pesa</span>
                          <span className="text-emerald-400">100%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5 opacity-40">
                          <span className="text-slate-400">Airtel Money</span>
                          <span>0%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full opacity-30">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5 opacity-40">
                          <span className="text-slate-400">Visa / Mastercard</span>
                          <span>0%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full opacity-30">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-800 p-3.5 rounded-xl mt-6">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">Engine Optimization Note</p>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">M-Pesa API tunnels are running at maximum capacity. Route nodes are verifying webhooks in less than 240ms.</p>
                  </div>
                </div>

              </div>

              {/* LIVE TRANSACTION REGISTRY FEED */}
              <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight">Live Transaction Registry</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Real-time inspection of incoming checkout request tasks. Click a row to view itemized breakdowns.</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full self-start sm:self-auto animate-pulse">
                    POLLING TUNNEL SECURE
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-slate-400 font-bold bg-gray-50/70">
                        <th className="px-6 py-3.5 tracking-wider uppercase">Invoice Reference</th>
                        <th className="px-6 py-3.5 tracking-wider uppercase">Customer Handset</th>
                        <th className="px-6 py-3.5 tracking-wider uppercase">Method</th>
                        <th className="px-6 py-3.5 tracking-wider uppercase">Gross Value</th>
                        <th className="px-6 py-3.5 tracking-wider uppercase">Status</th>
                        <th className="px-6 py-3.5 tracking-wider uppercase">Settlement Clock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-10 text-center font-bold text-slate-400 bg-gray-50/30">
                            {searchQuery ? "No matching records found matching your tokens." : "No operations captured on the active ledger network yet."}
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((tx) => (
                          <tr 
                            key={tx.id} 
                            onClick={() => setSelectedTransaction(tx)}
                            className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-slate-900 select-all">{tx.merchantReference || 'N/A'}</td>
                            <td className="px-6 py-4 text-slate-500 font-mono">{tx.customerIdentifier || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 border border-slate-200/60 rounded-md text-slate-600">
                                {tx.paymentMethod}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-black text-slate-900">Ksh {tx.amountGross.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                tx.status === 'SUCCESS' 
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                  : tx.status === 'FAILED' 
                                    ? 'bg-red-50 border-red-100 text-red-700' 
                                    : 'bg-amber-50 border-amber-100 text-amber-700'
                              }`}>
                                {tx.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> : tx.status === 'FAILED' ? <XCircle className="w-3 h-3 stroke-[2.5]" /> : <div className="animate-spin w-2 h-2 border border-amber-700 border-t-transparent rounded-full" />}
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-400 font-medium">
                              {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: GATEWAY PROFILE AND PARAMETERS SETTINGS */}
          {currentView === 'settings' && (
            <>
              {/* Settings Header Row */}
              <div className="mb-2">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gateway Profiles & Parameters</h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">Manage server token authorization strings and public endpoint response lifecycle anchors.</p>
              </div>

              {/* Mounted Webhook and Token Key Controls Component */}
              <GatewaySettings />
            </>
          )}

        </div>
      </main>

      {/* 3. SLIDING ITEMIZED TRANSACTION MODAL OVERLAY */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-all duration-200">
          {/* Backdrop dismiss anchor */}
          <div className="flex-1" onClick={() => setSelectedTransaction(null)} />
          
          <div className="w-full max-w-lg bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-gray-100 animate-in slide-in-from-right duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-slate-900 text-white rounded-xl">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Ledger Entry Audit</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">Itemized Data Breakdown</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="p-1.5 rounded-xl border border-gray-200 text-gray-400 hover:text-slate-900 bg-white hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body Context */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Dynamic Banner Header */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                selectedTransaction.status === 'SUCCESS'
                  ? 'bg-emerald-50/60 border-emerald-100 text-emerald-900'
                  : selectedTransaction.status === 'FAILED'
                    ? 'bg-red-50/60 border-red-100 text-red-900'
                    : 'bg-amber-50/60 border-amber-100 text-amber-900'
              }`}>
                <div>
                  <p className="text-[10px] font-black tracking-wide uppercase opacity-60">Settlement Total Amount</p>
                  <p className="text-2xl font-black tracking-tight mt-0.5">Ksh {selectedTransaction.amountGross.toFixed(2)}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border bg-white ${
                  selectedTransaction.status === 'SUCCESS' ? 'border-emerald-200 text-emerald-700' : selectedTransaction.status === 'FAILED' ? 'border-red-200 text-red-700' : 'border-amber-200 text-amber-700'
                }`}>
                  {selectedTransaction.status === 'SUCCESS' ? <CheckCircle2 className="w-3.5 h-3.5" /> : selectedTransaction.status === 'FAILED' ? <XCircle className="w-3.5 h-3.5" /> : <div className="animate-spin w-2.5 h-2.5 border-2 border-amber-700 border-t-transparent rounded-full" />}
                  <span>{selectedTransaction.status}</span>
                </div>
              </div>

              {/* Transaction Properties Metadata Matrix */}
              <div className="space-y-3 bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs">
                <h4 className="text-[11px] font-black text-slate-400 tracking-wider uppercase mb-1">Core Identifiers</h4>
                
                <div className="grid grid-cols-2 gap-y-3 font-medium">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Hash className="w-3.5 h-3.5 shrink-0" />
                    <span>Invoice Reference</span>
                  </div>
                  <div className="text-slate-900 font-bold text-right select-all truncate">{selectedTransaction.merchantReference || 'N/A'}</div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                    <span>Customer Handset</span>
                  </div>
                  <div className="text-slate-900 font-mono text-right truncate">{selectedTransaction.customerIdentifier || 'N/A'}</div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span>Gateway Token Ref</span>
                  </div>
                  <div className="text-slate-600 font-mono text-right select-all truncate">{selectedTransaction.gatewayReference || 'None Assigned'}</div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Timestamp Clock</span>
                  </div>
                  <div className="text-slate-600 text-right">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Real-time Itemized Snapshot Breakdown Panel */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-400 tracking-wider uppercase">Itemized Cart Breakdown</h4>
                
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50/70 border-b border-gray-100 px-4 py-2.5 grid grid-cols-12 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <div className="col-span-6">Product Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-4 text-right">Subtotal</div>
                  </div>
                  
                  <div className="divide-y divide-gray-50 text-xs font-medium max-h-48 overflow-y-auto">
                    {parseItemizedPayload(selectedTransaction.itemizedPayload).length === 0 ? (
                      <div className="p-4 text-center text-slate-400 font-bold bg-gray-50/20 italic">
                        No product breakdown attached. Shared legacy payment channel asset.
                      </div>
                    ) : (
                      parseItemizedPayload(selectedTransaction.itemizedPayload).map((item, idx) => (
                        <div key={idx} className="px-4 py-3 grid grid-cols-12 items-center hover:bg-gray-50/40">
                          <div className="col-span-6 font-bold text-slate-900 truncate">{item.product_name || item.name || 'Unnamed Asset'}</div>
                          <div className="col-span-2 text-center text-slate-500 font-mono">x{item.qty || item.quantity || 1}</div>
                          <div className="col-span-4 text-right font-black text-slate-800">
                            Ksh {((item.qty || item.quantity || 1) * (item.price || item.unit_price || 0)).toFixed(2)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Ledger Settlement Splits */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2.5 text-xs">
                <h4 className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Platform Split Settlement</h4>
                
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Gross Deducted Volume:</span>
                  <span className="font-bold">Ksh {selectedTransaction.amountGross.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Processing Platform Cut ({selectedTransaction.paymentMethod}):</span>
                  <span className="text-red-400 font-bold">- Ksh {(selectedTransaction.processingFee || 0).toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-slate-800 my-1" />
                
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-300 font-bold">Net Merchant Remittance:</span>
                  <span className="text-lg font-black text-emerald-400">
                    Ksh {(selectedTransaction.amountNet || selectedTransaction.amountGross - (selectedTransaction.processingFee || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Operational Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-bold text-gray-400 select-none">
                Tx UUID: {selectedTransaction.id.substring(0, 18)}...
              </span>
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MerchantDashboard;