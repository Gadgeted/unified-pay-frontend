"use client";

import React, { useState } from 'react';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';
import { DashboardMetrics } from '@/types/gateway';
import { LayoutDashboard, CreditCard, Box, Settings, LogOut, Bell, Search, ShieldCheck } from 'lucide-react';
import MerchantDashboard from "@/components/dashboard/MerchantDashboard";

export default function DashboardPage() {
  return (
    <main>
      {/* Any layout wrappers like Sidebars or Navbar can go here */}
      <MerchantDashboard />
    </main>
  );
}