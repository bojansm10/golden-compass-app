'use client';

import React from 'react';
import { BarChart3, Shield, Activity, ArrowRight } from 'lucide-react';

export default function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Simplified Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-3 border border-cyan-500/30">
                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-cyan-400">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                    <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                    <path d="M20 2 L22 8 L20 6 L18 8 Z" fill="currentColor"/>
                    <path d="M38 20 L32 18 L34 20 L32 22 Z" fill="currentColor"/>
                    <path d="M20 38 L18 32 L20 34 L22 32 Z" fill="currentColor"/>
                    <path d="M2 20 L8 22 L6 20 L8 18 Z" fill="currentColor"/>
                    <circle cx="20" cy="20" r="2" fill="currentColor"/>
                    <path d="M20 8 L24 20 L20 32 L16 20 Z" fill="url(#compassGradient)" opacity="0.8"/>
                    <path d="M8 28 L12 24 L16 26 L20 20 L24 22 L28 18 L32 20" 
                          fill="none" 
                          stroke="rgba(34, 197, 94, 0.6)" 
                          strokeWidth="1.5"
                          opacity="0.7"/>
                    <defs>
                      <linearGradient id="compassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee"/>
                        <stop offset="100%" stopColor="#3b82f6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Golden Compass</h1>
                <p className="text-sm text-gray-400">Trading Command Center</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => onNavigate('login')}
                className="px-4 py-2 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="px-4 md:px-6 py-10 md:py-20">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
              Master Your Trading Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
              Professional trading journal with advanced analytics, risk management, and real-time performance monitoring. Navigate your path to consistent profitability.
            </p>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-3 mx-auto transition-all shadow-lg shadow-cyan-500/20"
            >
              Start Trading Smarter
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
            <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-gray-800">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
              <p className="text-gray-400">Real-time performance tracking with comprehensive metrics, win rates, and profit analysis.</p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 border border-gray-800">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Shield size={32} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Risk Management</h3>
              <p className="text-gray-400">Built-in risk controls, daily limits, and intelligent position sizing to protect your capital.</p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 border border-gray-800">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Activity size={32} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Health Monitoring</h3>
              <p className="text-gray-400">Live account health oscillator with EKG-style visualization of your trading performance.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}