"use client";

import { UnifiedCheckoutWidget } from "@/components/checkout-widget";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 antialiased">
      {/* Decorative branding background blur elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-400 blur-[120px]" />
        <div className="absolute top-[-5%] right-[20%] w-[350px] h-[350px] rounded-full bg-emerald-400 blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10 space-y-4">
        {/* Environment badge indicator */}
        <div className="flex items-center justify-center space-x-2 bg-slate-100 border border-slate-200/60 rounded-full py-1 px-3 w-fit mx-auto shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
            Sandbox Dev Mode Environment
          </span>
        </div>

        {/* Mount point for our self-contained interactive gateway widget wrapper */}
        <UnifiedCheckoutWidget 
          amount={10} 
          currency="KES" 
          merchantName="Maina Electronics & Spares" 
        />

        {/* Footer legalities or platform compliance frames */}
        <p className="text-center text-[11px] font-medium text-slate-400 select-none">
          Powered by Unified Pay Gateway • 2026
          {/* Secure 256-bit SSL Encryption */}
        </p>
      </div>
    </main>
  );
}