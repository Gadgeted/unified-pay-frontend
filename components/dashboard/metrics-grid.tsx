"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DashboardMetrics } from '@/types/gateway';
import { ArrowUpRight, TrendingUp, Wallet, Percent, Users, Layers } from 'lucide-react';

interface MetricsGridProps {
  data: DashboardMetrics;
}

export function MetricsGrid({ data }: MetricsGridProps) {
  const { metrics, transactionCount } = data;

  const cards = [
    {
      title: "Total Gross Volume",
      value: `KES ${metrics.totalGrossVolume.toLocaleString()}`,
      description: "Total value of processed transactions",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50/60",
    },
    {
      title: "Withdrawable Balance",
      value: `KES ${metrics.withdrawableBalance.toLocaleString()}`,
      description: "Net funds available for instant payout",
      icon: <Wallet className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50/60",
    },
    {
      title: "Platform Fees",
      value: `KES ${metrics.platformFeesCollected.toLocaleString()}`,
      description: "Gateway processing revenue share",
      icon: <Percent className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50/60",
    },
    {
      title: "Total Transactions",
      value: transactionCount.toLocaleString(),
      description: "Successfully settled checkout payments",
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50/60",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${card.bg}`}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-gray-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-gray-400 mt-1 font-medium">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Internal Net Profit Analytical Formula Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ArrowUpRight className="w-24 h-24 stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Net Business Profit Margin
          </p>
          <div className="text-3xl font-black mt-2 tracking-tight text-emerald-400">
            KES {metrics.netBusinessProfit.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed max-w-sm">
            Calculated cleanly after accounting for platform gateway fees, operating expenses, and staff payroll overheads.
          </p>
        </Card>

        <Card className="p-6 border border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Channel Volume Split Ratio
          </h4>
          <div className="space-y-3">
            {[
              { name: "M-Pesa Mobile Money", value: data.channelVolumeDistribution.mpesa, color: "bg-mpesa" },
              { name: "Airtel Money Mobile", value: data.channelVolumeDistribution.airtel, color: "bg-airtel" },
              { name: "Card (Visa/Mastercard)", value: data.channelVolumeDistribution.card, color: "bg-blue-600" },
              { name: "Crypto Assets (USDC)", value: data.channelVolumeDistribution.crypto, color: "bg-crypto" }
            ].map((channel, idx) => {
              const percentage = (channel.value / metrics.totalGrossVolume) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>{channel.name}</span>
                    <span className="font-mono text-gray-500">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${channel.color} rounded-full`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}