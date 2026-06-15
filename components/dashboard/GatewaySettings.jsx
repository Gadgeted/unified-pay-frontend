"use client";

import React, { useState, useEffect } from 'react';
import { Key, Globe, Copy, Check, RefreshCw, Save, AlertTriangle, ShieldAlert } from 'lucide-react';

const GatewaySettings = () => {
  const [activeTab, setActiveTab] = useState('keys'); // 'keys' | 'webhooks'
  const [settings, setSettings] = useState({ apiKey: '', webhookUrl: '' });
  const [webhookInput, setWebhookInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [showRotateConfirm, setShowRotateConfirm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchSettings = async () => {
    try {
      const rootUrl = process.env.NEXT_PUBLIC_GATEWAY_URL?.replace(/\/+$/, '');
      const currentApiKey = process.env.NEXT_PUBLIC_MERCHANT_API_KEY;

      const res = await fetch(`${rootUrl}/merchant/settings`, {
        headers: { 'x-api-key': currentApiKey }
      });
      if (!res.ok) throw new Error("Could not parse infrastructure properties.");
      
      const data = await res.json();
      setSettings({ apiKey: data.apiKey, webhookUrl: data.webhookUrl });
      setWebhookInput(data.webhookUrl);
    } catch (err) {
      triggerMessage('error', 'Failed to load merchant gateway credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const triggerMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(settings.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateWebhook = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const rootUrl = process.env.NEXT_PUBLIC_GATEWAY_URL?.replace(/\/+$/, '');
      const currentApiKey = process.env.NEXT_PUBLIC_MERCHANT_API_KEY;

      const res = await fetch(`${rootUrl}/merchant/settings/webhook`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': currentApiKey
        },
        body: JSON.stringify({ webhookUrl: webhookInput })
      });

      if (!res.ok) throw new Error("Webhook update handshake rejected.");
      const data = await res.json();
      setSettings(prev => ({ ...prev, webhookUrl: data.webhookUrl }));
      triggerMessage('success', 'Webhook destination endpoint updated successfully.');
    } catch (err) {
      triggerMessage('error', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRotateApiKey = async () => {
    setRotating(true);
    try {
      const rootUrl = process.env.NEXT_PUBLIC_GATEWAY_URL?.replace(/\/+$/, '');
      const currentApiKey = process.env.NEXT_PUBLIC_MERCHANT_API_KEY;

      const res = await fetch(`${rootUrl}/merchant/settings/rotate-key`, {
        method: 'PATCH',
        headers: { 'x-api-key': currentApiKey }
      });

      if (!res.ok) throw new Error("Key rotation script failed.");
      const data = await res.json();
      
      setSettings(prev => ({ ...prev, apiKey: data.newApiKey }));
      setShowRotateConfirm(false);
      triggerMessage('success', 'API credential rolled out successfully! Remember to update your frontend .env.local file immediately.');
    } catch (err) {
      triggerMessage('error', err.message);
    } finally {
      setRotating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-xs font-bold text-slate-400 animate-pulse uppercase tracking-wider">
        Querying secure terminal parameters...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl w-full">
      
      {/* Dynamic Status Notifications */}
      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-bold border transition-all animate-fadeIn ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tab Selector Links */}
      <div className="flex space-x-2 border-b border-gray-200 pb-px">
        <button 
          onClick={() => setActiveTab('keys')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'keys' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Access Control</span>
        </button>
        <button 
          onClick={() => setActiveTab('webhooks')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'webhooks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Webhook Subscriptions</span>
        </button>
      </div>

      {/* TAB CONTENT 1: API KEYS SECURITY MANAGEMENT */}
      {activeTab === 'keys' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h4 className="text-sm font-black text-slate-950 tracking-tight">Secret API Tokens</h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Authenticate secure server payloads sent directly over payment gateway nodes.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Live Token Token String</label>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                readOnly 
                value={settings.apiKey} 
                className="bg-gray-50 border border-gray-200 text-xs font-mono text-slate-800 px-4 py-3 rounded-xl w-full select-all outline-none"
              />
              <button 
                onClick={copyToClipboard}
                className="p-3 bg-gray-50 border border-gray-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
                title="Copy Token to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-black tracking-tight">Security Alert Buffer</p>
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                Rotating your access keys cancels current authentication structures instantly. Any remote points or connected applications (like your Point of Sale client) will fail requests until updated with the fresh secret code.
              </p>
            </div>
          </div>

          {!showRotateConfirm ? (
            <button 
              onClick={() => setShowRotateConfirm(true)}
              className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate Credentials Token</span>
            </button>
          ) : (
            <div className="p-4 border border-red-200 rounded-xl bg-red-50/50 space-y-4 animate-fadeIn">
              <div className="flex items-start space-x-3 text-red-950">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-black tracking-tight">Confirm Destructive Operation?</h5>
                  <p className="text-[11px] font-medium text-red-800 mt-0.5 leading-relaxed">This process cannot be reverted. Confirm your operational clearance state.</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleRotateApiKey}
                  disabled={rotating}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-xs font-bold rounded-lg disabled:opacity-50 transition-all shadow-sm"
                >
                  {rotating ? 'Rolling Node Keys...' : 'Yes, Revoke Key'}
                </button>
                <button 
                  onClick={() => setShowRotateConfirm(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 text-xs font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: WEBHOOK LIFECYCLE MANAGEMENT */}
      {activeTab === 'webhooks' && (
        <form onSubmit={handleUpdateWebhook} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h4 className="text-sm font-black text-slate-950 tracking-tight">Live Webhook Channels</h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Configure your custom HTTP POST address where our systems will stream automated confirmation payloads as soon as M-Pesa captures payments.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Merchant Callback Destination URI</label>
            <input 
              type="url" 
              required
              placeholder="https://your-app-domain.com/api/payment-webhook"
              value={webhookInput} 
              onChange={(e) => setWebhookInput(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs font-medium text-slate-800 px-4 py-3 rounded-xl w-full outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>

          <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl">
            <h5 className="text-xs font-black text-slate-800 tracking-tight mb-2">Payload Scheme Specifications</h5>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Automated triggers send formatted events containing: <code className="font-mono text-[10px] bg-gray-200 text-slate-800 px-1 py-0.5 rounded">merchantReference</code>, <code className="font-mono text-[10px] bg-gray-200 text-slate-800 px-1 py-0.5 rounded">amountGross</code>, and <code className="font-mono text-[10px] bg-gray-200 text-slate-800 px-1 py-0.5 rounded">status: "SUCCESS" | "FAILED"</code>. Your target resource endpoint must process hooks and response execute with an HTTP <code className="font-mono text-[10px] text-emerald-700 font-bold">200 OK</code> confirmation block.
            </p>
          </div>

          <button 
            type="submit"
            disabled={updating || webhookInput === settings.webhookUrl}
            className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md shadow-blue-600/10"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{updating ? 'Saving Webhook Route...' : 'Save Subscription Route'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default GatewaySettings;