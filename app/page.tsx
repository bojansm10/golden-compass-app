'use client';

import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Plus, X, DollarSign, TrendingUp, AlertTriangle, Award, Clock, Activity, Users, Zap, Shield, Target, BarChart3, Sparkles, ChevronUp, ChevronDown, Brain, Flame, Settings, ArrowRight, Eye, EyeOff, Mail, Lock, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Landing Page Component
const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-[200px] animate-pulse" style={{transform: 'translateZ(0)'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-[200px] animate-pulse" style={{animationDelay: '4s', transform: 'translateZ(0)'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6">
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
        <main className="px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
              Master Your Trading Journey
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional trading journal with advanced analytics, risk management, and real-time performance monitoring. Navigate your path to consistent profitability.
            </p>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-3 mx-auto transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/20"
            >
              Start Trading Smarter
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 border border-gray-800">
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
};

// Login Page Component
const LoginPage = ({ onNavigate, onLogin }: { onNavigate: (page: string) => void, onLogin: (user: any) => void }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert('Login failed: ' + error.message);
      } else if (data.user) {
        onLogin(data.user);
      }
    } catch (error) {
      alert('Login failed: ' + error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-[200px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">Sign in to your trading command center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="trader@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-12 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => onNavigate('register')}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>

          <button
            onClick={() => onNavigate('landing')}
            className="mt-4 w-full text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

// Register Page Component
const RegisterPage = ({ onNavigate, onLogin }: { onNavigate: (page: string) => void, onLogin: (user: any) => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          }
        }
      });

      if (error) {
        alert('Registration failed: ' + error.message);
      } else if (data.user) {
        // Create profile
        await supabase.from('profiles').insert([
          { 
            id: data.user.id, 
            email: formData.email, 
            name: formData.name,
            capital: 1000,
            risk_percent: 5,
            compounding_percent: 50
          }
        ]);
        
        alert('Registration successful! Please check your email to verify your account.');
        onNavigate('login');
      }
    } catch (error) {
      alert('Registration failed: ' + error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-[200px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              Join Golden Compass
            </h1>
            <p className="text-gray-400">Start your professional trading journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="trader@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-12 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => onNavigate('login')}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>

          <button
            onClick={() => onNavigate('landing')}
            className="mt-4 w-full text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Trade Form Component
const AddTradeForm = ({ 
  showAddTrade, 
  setShowAddTrade, 
  remainingAllowance, 
  maxLotSize, 
  trades, 
  setTrades, 
  compoundingPercent,
  user
}: any) => {
  const [formData, setFormData] = useState({
    instructor: '',
    instrument: 'DJ30',
    type: 'BUY',
    lotSize: 0.1,
    profit: '',
    entryPrice: '',
    exitPrice: '',
    customInstructor: ''
  });
  
  // Helper function to get user ID consistently
  const getUserId = (user: any) => {
    return user?.id || user?.user?.id;
  };
  
  // Pip value mapping for different instruments
  const getPipValue = (instrument: string, lotSize: number) => {
    const pipValues: Record<string, number> = {
      // Forex majors (per 0.01 lot)
      'EURUSD': 0.1, 'GBPUSD': 0.1, 'USDJPY': 0.1, 'USDCHF': 0.1,
      'AUDUSD': 0.1, 'USDCAD': 0.1, 'NZDUSD': 0.1,
      // Forex minors
      'EURJPY': 0.1, 'EURGBP': 0.1, 'GBPJPY': 0.1, 'AUDCAD': 0.1,
      'CADJPY': 0.1, 'CHFJPY': 0.1, 'EURAUD': 0.1, 'EURNZD': 0.1,
      'GBPAUD': 0.1, 'GBPNZD': 0.1,
      // Indices (per 0.01 lot)
      'DJ30': 0.1, 'SPX500': 0.1, 'NAS100': 0.1, 'DAX40': 0.1,
      'FTSE100': 0.1, 'NIK225': 0.1, 'ASX200': 0.1, 'HK50': 0.1,
      // Commodities
      'XAUUSD': 1, 'XAGUSD': 5, 'USOIL': 1, 'UKOIL': 1,
      'NATGAS': 1, 'COPPER': 1,
      // Crypto
      'BTCUSD': 1, 'ETHUSD': 0.1, 'LTCUSD': 0.01, 'ADAUSD': 0.0001, 'DOTUSD': 0.001
    };
    
    return (pipValues[instrument] || 0.1) * (lotSize / 0.01);
  };
  
  // Calculate pips from profit
  const calculatePips = (profit: number, instrument: string, lotSize: number) => {
    if (!profit || !instrument || !lotSize) return 0;
    const pipValue = getPipValue(instrument, lotSize);
    return Math.abs(profit / pipValue);
  };
  
  const calculatedPips = calculatePips(parseFloat(formData.profit) || 0, formData.instrument, formData.lotSize);
  
  const handleSubmit = async () => {
    const instructorName = formData.instructor === 'Other' ? formData.customInstructor : formData.instructor;
    
    if (!instructorName || !formData.profit) {
      alert('Please fill all required fields');
      return;
    }
    
    const profitAmount = parseFloat(formData.profit);
    
    if (profitAmount < 0 && Math.abs(profitAmount) > remainingAllowance) {
      if (!confirm(`This trade exceeds your daily risk limit! You can only lose $${remainingAllowance.toFixed(2)} more today. Continue anyway?`)) {
        return;
      }
    }
    
    const userId = getUserId(user);
    if (!userId) {
      alert('User ID not found!');
      return;
    }
    
    const newTrade = {
      user_id: userId,
      instructor: instructorName,
      instrument: formData.instrument,
      type: formData.type,
      lot_size: parseFloat(formData.lotSize.toString()),
      profit: profitAmount,
      pips: calculatedPips,
      entry_price: parseFloat(formData.entryPrice) || null,
      exit_price: parseFloat(formData.exitPrice) || null
    };
    
    try {
      const { data, error } = await supabase
        .from('trades')
        .insert([newTrade])
        .select();
        
      if (error) {
        alert('Failed to save trade: ' + error.message);
      } else {
        setTrades([...trades, data[0]]);
        setShowAddTrade(false);
        setFormData({
          instructor: '',
          instrument: 'DJ30',
          type: 'BUY',
          lotSize: 0.1,
          profit: '',
          entryPrice: '',
          exitPrice: '',
          customInstructor: ''
        });
      }
    } catch (error) {
      alert('Failed to save trade: ' + error);
    }
  };
  
  if (!showAddTrade) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-cyan-500/20 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-cyan-500/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            New Trade Entry
          </h2>
          <button 
            onClick={() => setShowAddTrade(false)} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Instructor</label>
            {formData.instructor === 'Other' ? (
              <input
                type="text"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.customInstructor}
                onChange={(e) => setFormData({...formData, customInstructor: e.target.value})}
                placeholder="Enter instructor name..."
                autoFocus
              />
            ) : (
              <select 
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value, customInstructor: ''})}
              >
                <option value="">Select instructor...</option>
                <option value="Kristijan S.">Kristijan S.</option>
                <option value="Abdallah">Abdallah</option>
                <option value="Ploutos">Ploutos</option>
                <option value="Edris">Edris</option>
                <option value="Bojan S.">Bojan S.</option>
                <option value="Self">Self</option>
                <option value="Other">Other (custom)</option>
              </select>
            )}
            {formData.instructor === 'Other' && (
              <button
                type="button"
                onClick={() => setFormData({...formData, instructor: '', customInstructor: ''})}
                className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 transition-colors"
              >
                ← Back to list
              </button>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Instrument</label>
            <select 
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.instrument}
              onChange={(e) => setFormData({...formData, instrument: e.target.value})}
            >
              <optgroup label="Forex Majors">
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="USDCHF">USD/CHF</option>
                <option value="AUDUSD">AUD/USD</option>
                <option value="USDCAD">USD/CAD</option>
                <option value="NZDUSD">NZD/USD</option>
              </optgroup>
              <optgroup label="Forex Minors">
                <option value="EURJPY">EUR/JPY</option>
                <option value="EURGBP">EUR/GBP</option>
                <option value="GBPJPY">GBP/JPY</option>
                <option value="AUDCAD">AUD/CAD</option>
                <option value="CADJPY">CAD/JPY</option>
                <option value="CHFJPY">CHF/JPY</option>
                <option value="EURAUD">EUR/AUD</option>
                <option value="EURNZD">EUR/NZD</option>
                <option value="GBPAUD">GBP/AUD</option>
                <option value="GBPNZD">GBP/NZD</option>
              </optgroup>
              <optgroup label="Indices">
                <option value="DJ30">Dow Jones 30</option>
                <option value="SPX500">S&P 500</option>
                <option value="NAS100">NASDAQ 100</option>
                <option value="DAX40">DAX 40</option>
                <option value="FTSE100">FTSE 100</option>
                <option value="NIK225">Nikkei 225</option>
                <option value="ASX200">ASX 200</option>
                <option value="HK50">Hang Seng 50</option>
              </optgroup>
              <optgroup label="Commodities">
                <option value="XAUUSD">Gold (XAU/USD)</option>
                <option value="XAGUSD">Silver (XAG/USD)</option>
                <option value="USOIL">Crude Oil (WTI)</option>
                <option value="UKOIL">Brent Oil</option>
                <option value="NATGAS">Natural Gas</option>
                <option value="COPPER">Copper</option>
              </optgroup>
              <optgroup label="Cryptocurrency">
                <option value="BTCUSD">Bitcoin (BTC/USD)</option>
                <option value="ETHUSD">Ethereum (ETH/USD)</option>
                <option value="LTCUSD">Litecoin (LTC/USD)</option>
                <option value="ADAUSD">Cardano (ADA/USD)</option>
                <option value="DOTUSD">Polkadot (DOT/USD)</option>
              </optgroup>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Direction</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'BUY'})}
                className={`py-3 rounded-xl font-medium transition-all ${
                  formData.type === 'BUY' 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-green-400 shadow-lg shadow-green-500/20' 
                    : 'bg-black/40 border border-gray-700 text-gray-400 hover:border-green-400/30'
                }`}
              >
                LONG
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'SELL'})}
                className={`py-3 rounded-xl font-medium transition-all ${
                  formData.type === 'SELL' 
                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/50 text-red-400 shadow-lg shadow-red-500/20' 
                    : 'bg-black/40 border border-gray-700 text-gray-400 hover:border-red-400/30'
                }`}
              >
                SHORT
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Lot Size <span className="text-xs text-gray-400">(Max: {maxLotSize})</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.lotSize}
              onChange={(e) => setFormData({...formData, lotSize: parseFloat(e.target.value) || 0})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Entry Price <span className="text-xs text-gray-400">(notes)</span></label>
              <input
                type="number"
                step="0.0001"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.entryPrice}
                onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
                placeholder="0.0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Exit Price <span className="text-xs text-gray-400">(notes)</span></label>
              <input
                type="number"
                step="0.0001"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.exitPrice}
                onChange={(e) => setFormData({...formData, exitPrice: e.target.value})}
                placeholder="0.0000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Profit/Loss (USD) *</label>
            <input
              type="number"
              step="0.01"
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white text-lg font-medium focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.profit}
              onChange={(e) => setFormData({...formData, profit: e.target.value})}
              placeholder="Enter P&L (negative for loss)"
            />
            <p className="text-xs text-gray-500 mt-2">Enter negative value for losses (e.g., -50)</p>
            {calculatedPips > 0 && (
              <p className="text-xs text-cyan-400 mt-1">
                ≈ {calculatedPips.toFixed(1)} pips
              </p>
            )}
          </div>
          
          {formData.profit && (
            <div className={`border rounded-2xl p-4 backdrop-blur-sm ${
              parseFloat(formData.profit) >= 0 
                ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30' 
                : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30'
            }`}>
              <p className={`text-sm font-semibold mb-2 ${
                parseFloat(formData.profit) >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                Trade Summary
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">P&L:</span>
                  <span className={`font-bold text-lg ${parseFloat(formData.profit) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {parseFloat(formData.profit || '0') >= 0 ? '+' : ''}${parseFloat(formData.profit || '0').toFixed(2)}
                  </span>
                </div>
                {parseFloat(formData.profit) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Saved ({compoundingPercent}%):</span>
                    <span className="font-medium text-cyan-400">
                      ${(parseFloat(formData.profit) * compoundingPercent / 100).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              {parseFloat(formData.profit) < 0 && Math.abs(parseFloat(formData.profit)) > remainingAllowance && (
                <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-xs text-red-400 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    Exceeds daily risk limit!
                  </p>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25"
          >
            Execute Trade
          </button>
        </div>
      </div>
    </div>
  );
};

// Trading Dashboard Component
const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [trades, setTrades] = useState<any[]>([]);
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [capital, setCapital] = useState(1000);
  const [compoundingPercent, setCompoundingPercent] = useState(50);
  const [riskPercent, setRiskPercent] = useState(5);
  const [showCapitalEdit, setShowCapitalEdit] = useState(false);
  const [showRiskEdit, setShowRiskEdit] = useState(false);
  const [showCompoundingEdit, setShowCompoundingEdit] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showSupportTicket, setShowSupportTicket] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Helper function to get user ID consistently
  const getUserId = (user: any) => {
    return user?.id || user?.user?.id;
  };

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      console.log('User object:', user); // Check what user object contains
      console.log('User ID:', getUserId(user)); // Check the extracted user ID
      
      const userId = getUserId(user);
      if (!userId) {
        console.error('No user ID found!');
        return;
      }
      
      console.log('Loading settings for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('capital, risk_percent, compounding_percent')
        .eq('id', userId)
        .single();
      
      console.log('Loaded data:', data);
      console.log('Load error:', error);
      
      if (data) {
        // Handle NULL values properly
        setCapital(data.capital !== null ? Number(data.capital) : 1000);
        setRiskPercent(data.risk_percent !== null ? Number(data.risk_percent) : 5);
        setCompoundingPercent(data.compounding_percent !== null ? Number(data.compounding_percent) : 50);
        console.log('Settings applied:', {
          capital: data.capital,
          risk: data.risk_percent,
          compounding: data.compounding_percent
        });
      }
    };
    
    loadSettings();
  }, [user]);

  // Load trades on mount
  useEffect(() => {
    loadTrades();
  }, [user]);

  const loadTrades = async () => {
    try {
      const userId = getUserId(user);
      if (!userId) {
        console.error('No user ID found for loading trades!');
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading trades:', error);
      } else {
        setTrades(data || []);
      }
    } catch (error) {
      console.error('Error loading trades:', error);
    }
    setLoading(false);
  };

  // Save settings function
  const saveSettings = async () => {
    const userId = getUserId(user);
    if (!userId) {
      alert('User ID not found!');
      return;
    }
    
    const valuesToSave = {
      capital: Number(capital),
      risk_percent: Number(riskPercent),
      compounding_percent: Number(compoundingPercent)
    };
    
    console.log('Saving for user:', userId);
    console.log('Values to save:', valuesToSave);
    
    const { data, error } = await supabase
      .from('profiles')
      .update(valuesToSave)
      .eq('id', userId)
      .select(); // Add .select() to see what was updated
    
    if (error) {
      console.error('Save error:', error);
      alert('Failed to save settings: ' + error.message);
    } else {
      console.log('Save successful:', data);
      alert('Settings saved successfully!');
      
      // Optionally reload settings to confirm they persisted
      const { data: reloadData } = await supabase
        .from('profiles')
        .select('capital, risk_percent, compounding_percent')
        .eq('id', userId)
        .single();
      
      console.log('Reloaded data after save:', reloadData);
    }
  };

  // Calculate functions
  const calculateAvailable = () => {
    let available = capital;
    trades.forEach(trade => {
      available += trade.profit;
      if (trade.profit > 0) {
        available -= trade.profit * (compoundingPercent / 100);
      }
    });
    return available;
  };
  
  const calculateSaved = () => {
    let saved = 0;
    trades.forEach(trade => {
      if (trade.profit > 0) {
        saved += trade.profit * (compoundingPercent / 100);
      }
    });
    return saved;
  };
  
  const calculateTodayPL = () => {
    const today = new Date().toDateString();
    return trades
      .filter(t => new Date(t.created_at).toDateString() === today)
      .reduce((sum, t) => sum + t.profit, 0);
  };
  
  const calculateStats = () => {
    const wins = trades.filter(t => t.profit > 0).length;
    const losses = trades.filter(t => t.profit < 0).length;
    const total = trades.length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    return { wins, losses, total, winRate };
  };
  
  const getInstructorStats = () => {
    const instructorMap: Record<string, any> = {};
    
    trades.forEach(trade => {
      if (!instructorMap[trade.instructor]) {
        instructorMap[trade.instructor] = {
          trades: 0,
          profit: 0,
          wins: 0,
          pips: 0
        };
      }
      
      instructorMap[trade.instructor].trades++;
      instructorMap[trade.instructor].profit += trade.profit;
      instructorMap[trade.instructor].pips += trade.pips || 0;
      if (trade.profit > 0) instructorMap[trade.instructor].wins++;
    });
    
    return Object.entries(instructorMap)
      .map(([instructor, stats]: [string, any]) => ({
        instructor,
        ...stats,
        winRate: stats.trades > 0 ? (stats.wins / stats.trades * 100).toFixed(1) : '0.0'
      }))
      .sort((a, b) => b.profit - a.profit);
  };
  
  const stats = calculateStats();
  const available = calculateAvailable();
  const saved = calculateSaved();
  const todayPL = calculateTodayPL();
  const dailyLimit = capital * (riskPercent / 100);
  const remainingAllowance = Math.max(0, dailyLimit - Math.abs(Math.min(todayPL, 0)));
  const maxLotSize = (available / 100 * 0.01).toFixed(2);
  const instructorStats = getInstructorStats();
  const totalPL = trades.reduce((sum, trade) => sum + trade.profit, 0);
  const riskUsed = dailyLimit > 0 ? (Math.abs(Math.min(todayPL, 0)) / dailyLimit) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your trading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-[200px] animate-pulse" style={{transform: 'translateZ(0)'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-[200px] animate-pulse" style={{animationDelay: '4s', transform: 'translateZ(0)'}}></div>
      </div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
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
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
                  Golden Compass
                </h1>
                <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 mb-2">
                  Trading Command Center
                </h2>
                <p className="text-gray-400 flex items-center gap-2">
                  <Brain size={16} className="text-cyan-400" />
                  Welcome back, {user.user_metadata?.name || user.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowQuickSettings(!showQuickSettings)}
                  className="flex items-center gap-2 text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all"
                >
                  <Settings size={14} />
                  Quick Settings
                </button>
                <button
                  onClick={() => setShowSupportTicket(true)}
                  className="flex items-center gap-2 text-xs px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-all"
                >
                  <span>🎧</span>
                  Support
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-xs px-3 py-1 bg-red-600 hover:bg-red-500 rounded-full text-white transition-all"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
              <div className="text-sm text-gray-500">
                <p>Risk Protocol: {riskPercent}% Daily</p>
                <p>Position Sizing: 0.01 lot / $100</p>
                <p>Compounding: {compoundingPercent}%</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Quick Settings Panel */}
        {showQuickSettings && (
          <div className="mb-6 bg-gray-900/40 backdrop-blur-md rounded-2xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-cyan-400" />
                <h3 className="text-sm font-semibold text-gray-300">Trading Parameters</h3>
              </div>
              <button
                onClick={() => setShowQuickSettings(false)}
                className="text-gray-400 hover:text-white transition-all p-1 hover:bg-white/10 rounded"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Trading Capital</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">$</span>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-black/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Daily Risk Limit (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-black/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-yellow-500/50 transition-all"
                    min={1}
                    max={100}
                    step={0.5}
                  />
                  <span className="text-gray-400">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">= ${dailyLimit.toFixed(2)} max loss</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Compounding Rate (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={compoundingPercent}
                    onChange={(e) => setCompoundingPercent(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-black/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-purple-500/50 transition-all"
                    min={0}
                    max={100}
                    step={5}
                  />
                  <span className="text-gray-400">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">of profits saved</p>
              </div>
            </div>
            <button
              onClick={saveSettings}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-2 rounded-lg font-semibold transition-all"
            >
              💾 SAVE ALL SETTINGS
            </button>
          </div>
        )}
        
        {/* Motivational Quote Section */}
        <div className="mb-6 relative overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-md rounded-3xl p-8 border border-purple-500/20 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
            <div className="absolute top-4 left-8 text-6xl text-purple-400/20 font-serif">"</div>
            <div className="absolute bottom-4 right-8 text-6xl text-purple-400/20 font-serif transform rotate-180">"</div>
            <div className="relative z-10">
              <blockquote className="text-xl md:text-2xl font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-4 leading-relaxed tracking-wide" style={{fontFamily: "'Playfair Display', 'Georgia', serif", fontStyle: 'italic', letterSpacing: '0.02em'}}>
                The market is a device for transferring money from the impatient to the patient. Master your emotions, follow your strategy, and let time be your greatest ally.
              </blockquote>
              <cite className="text-sm text-purple-400/80 font-medium tracking-widest uppercase" style={{fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em'}}>
                — Golden Compass Wisdom
              </cite>
            </div>
          </div>
        </div>
        
        {/* Account Health Oscillator */}
        <div className="mb-6 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-md rounded-3xl p-6 border border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-yellow-500/5 to-green-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  (() => {
                    // Calculate health score
                    let healthScore = 0;
                    
                    // Win rate contribution (0-30 points)
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    
                    // Risk management (0-25 points) - better when lower risk used
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    
                    // ROI contribution (0-25 points)
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    
                    // Today's performance (0-20 points)
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'bg-green-500/20';
                    if (healthScore >= 60) return 'bg-yellow-500/20';
                    if (healthScore >= 40) return 'bg-orange-500/20';
                    return 'bg-red-500/20';
                  })()
                }`}>
                  <div className={`text-2xl ${
                    (() => {
                      let healthScore = 0;
                      healthScore += Math.min(stats.winRate * 0.3, 30);
                      healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                      const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                      healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                      if (todayPL >= 0) {
                        healthScore += Math.min(todayPL / 10, 20);
                      } else {
                        healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                      }
                      healthScore = Math.max(0, Math.min(100, healthScore));
                      
                      if (healthScore >= 80) return 'text-green-400';
                      if (healthScore >= 60) return 'text-yellow-400';
                      if (healthScore >= 40) return 'text-orange-400';
                      return 'text-red-400';
                    })()
                  }`}>
                    ⚡
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Account Health Monitor</h2>
                  <p className="text-sm text-gray-400">Live performance oscillator</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${
                  (() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'text-green-400';
                    if (healthScore >= 60) return 'text-yellow-400';
                    if (healthScore >= 40) return 'text-orange-400';
                    return 'text-red-400';
                  })()
                }`}>
                  {(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    return Math.max(0, Math.min(100, healthScore)).toFixed(0);
                  })()}%
                </div>
                <div className="text-sm text-gray-400">
                  {(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'STRONG';
                    if (healthScore >= 60) return 'STABLE';
                    if (healthScore >= 40) return 'WEAK';
                    return 'CRITICAL';
                  })()}
                </div>
              </div>
            </div>
            
            {/* Heartbeat Oscillator */}
            <div className="bg-black/50 rounded-2xl p-4 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>
              <svg 
                className="w-full h-20" 
                viewBox="0 0 800 80" 
                style={{filter: 'drop-shadow(0 0 8px currentColor)'}}
              >
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Heartbeat line */}
                <path
                  d={(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    // Generate heartbeat pattern based on health
                    const amplitude = Math.max(5, healthScore * 0.3);
                    
                    let path = "M 0,40";
                    for (let x = 0; x <= 800; x += 4) {
                      // Create heartbeat spikes every ~100 pixels
                      const beatPosition = (x % 120);
                      let y = 40;
                      
                      if (beatPosition > 40 && beatPosition < 80) {
                        if (beatPosition < 50) {
                          y = 40 - amplitude * 0.3; // Small pre-spike
                        } else if (beatPosition < 55) {
                          y = 40 + amplitude; // Main spike up
                        } else if (beatPosition < 60) {
                          y = 40 - amplitude * 1.5; // Sharp dip
                        } else if (beatPosition < 65) {
                          y = 40 + amplitude * 0.8; // Secondary spike
                        } else {
                          y = 40 - amplitude * 0.2; // Settle
                        }
                      }
                      
                      path += ` L ${x},${Math.max(5, Math.min(75, y))}`;
                    }
                    return path;
                  })()}
                  fill="none"
                  stroke={(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return '#22c55e';
                    if (healthScore >= 60) return '#eab308';
                    if (healthScore >= 40) return '#f97316';
                    return '#ef4444';
                  })()}
                  strokeWidth="2"
                  className="animate-pulse"
                />
                
                {/* Moving indicator dot */}
                <circle
                  cx="700"
                  cy="40"
                  r="3"
                  fill={(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return '#22c55e';
                    if (healthScore >= 60) return '#eab308';
                    if (healthScore >= 40) return '#f97316';
                    return '#ef4444';
                  })()}
                  className="animate-pulse"
                  style={{filter: 'drop-shadow(0 0 6px currentColor)'}}
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values="-700,0; 100,0; -700,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
              
              {/* Oscillator readings */}
              <div className="flex justify-between items-center mt-2 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-400">LIVE</span>
                  </div>
                  <span className="text-gray-500 font-mono">
                    BPM: {(() => {
                      let healthScore = 0;
                      healthScore += Math.min(stats.winRate * 0.3, 30);
                      healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                      const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                      healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                      if (todayPL >= 0) {
                        healthScore += Math.min(todayPL / 10, 20);
                      } else {
                        healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                      }
                      healthScore = Math.max(0, Math.min(100, healthScore));
                      return Math.round(60 + (healthScore * 0.8));
                    })()}
                  </span>
                </div>
                <span className="text-gray-500 font-mono">AMP: {(() => {
                  let healthScore = 0;
                  healthScore += Math.min(stats.winRate * 0.3, 30);
                  healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                  const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                  healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                  if (todayPL >= 0) {
                    healthScore += Math.min(todayPL / 10, 20);
                  } else {
                    healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                  }
                  healthScore = Math.max(0, Math.min(100, healthScore));
                  return (Math.max(5, healthScore * 0.3)).toFixed(1);
                })()}mV</span>
              </div>
            </div>
            
            {/* Health Factors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className={`font-semibold ${stats.winRate >= 60 ? 'text-green-400' : stats.winRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {stats.winRate.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Risk Usage</span>
                <span className={`font-semibold ${riskUsed <= 30 ? 'text-green-400' : riskUsed <= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {riskUsed.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ROI</span>
                <span className={`font-semibold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {capital > 0 ? ((totalPL / capital) * 100).toFixed(1) : '0.0'}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Today</span>
                <span className={`font-semibold ${todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {todayPL >= 0 ? '+' : ''}${todayPL.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Capital Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-2xl">
                  <Shield size={24} className="text-cyan-400" />
                </div>
                <button 
                  onClick={() => setShowCapitalEdit(!showCapitalEdit)}
                  className="text-xs px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-full text-cyan-400 transition-all flex items-center gap-1"
                >
                  <Settings size={12} />
                  EDIT
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-2">Trading Capital</p>
              <p className="text-3xl font-bold text-white">${capital.toLocaleString()}</p>
              {showCapitalEdit && (
                <div className="mt-3">
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-sm text-white"
                    onBlur={() => setShowCapitalEdit(false)}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">Your starting trading capital</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Available Capital */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                  <DollarSign size={24} className="text-blue-400" />
                </div>
                <span className="text-xs px-3 py-1 bg-blue-500/10 rounded-full text-blue-400">
                  MAX LOT: {maxLotSize}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Available Funds</p>
              <p className="text-3xl font-bold text-white">${available.toFixed(2)}</p>
              <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-all"
                  style={{width: `${(available / (capital + totalPL)) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Daily Risk */}
          <div className="relative group">
            <div className={`absolute inset-0 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity ${
              riskUsed > 80 ? 'bg-gradient-to-r from-red-500 to-pink-600' :
              riskUsed > 50 ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
              'bg-gradient-to-r from-yellow-500 to-amber-600'
            }`}></div>
            <div className={`relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4 border transition-all ${
              riskUsed > 80 ? 'border-red-500/20 hover:border-red-400/40' :
              riskUsed > 50 ? 'border-orange-500/20 hover:border-orange-400/40' :
              'border-yellow-500/20 hover:border-yellow-400/40'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${
                  riskUsed > 80 ? 'bg-red-500/20' :
                  riskUsed > 50 ? 'bg-orange-500/20' :
                  'bg-yellow-500/20'
                }`}>
                  <AlertTriangle size={24} className={
                    riskUsed > 80 ? 'text-red-400' :
                    riskUsed > 50 ? 'text-orange-400' :
                    'text-yellow-400'
                  } />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowRiskEdit(!showRiskEdit)}
                    className="text-xs px-3 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-full text-yellow-400 transition-all flex items-center gap-1"
                  >
                    <Settings size={12} />
                    {riskPercent}% RISK
                  </button>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    riskUsed > 80 ? 'bg-red-500/10 text-red-400' :
                    riskUsed > 50 ? 'bg-orange-500/10 text-orange-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {riskUsed.toFixed(0)}% USED
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2">Daily Risk Limit</p>
              <p className="text-3xl font-bold text-white">${dailyLimit.toFixed(2)}</p>
              <p className={`text-sm mt-2 ${
                riskUsed > 80 ? 'text-red-400' :
                riskUsed > 50 ? 'text-orange-400' :
                'text-gray-400'
              }`}>
                Remaining: ${remainingAllowance.toFixed(2)}
              </p>
              {showRiskEdit && (
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-black/50 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-white"
                      min={1}
                      max={100}
                      step={0.5}
                      onBlur={() => setShowRiskEdit(false)}
                      autoFocus
                    />
                    <span className="text-sm text-gray-400">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max daily loss as % of capital</p>
                </div>
              )}
              <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    riskUsed > 80 ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                    riskUsed > 50 ? 'bg-gradient-to-r from-orange-400 to-amber-400' :
                    'bg-gradient-to-r from-yellow-400 to-amber-400'
                  }`}
                  style={{width: `${100 - riskUsed}%`}}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Win Rate */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4 border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <Award size={24} className="text-emerald-400" />
                </div>
                <span className="text-xs px-3 py-1 bg-emerald-500/10 rounded-full text-emerald-400">
                  {stats.wins}W / {stats.losses}L
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Win Rate</p>
              <p className="text-3xl font-bold text-white">{stats.winRate.toFixed(1)}%</p>
              <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full transition-all"
                  style={{width: `${stats.winRate}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {/* Saved Amount */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Sparkles size={18} className="text-purple-400" />
              <button 
                onClick={() => setShowCompoundingEdit(!showCompoundingEdit)}
                className="text-xs px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 rounded-full text-purple-400 transition-all flex items-center gap-1"
              >
                <Settings size={10} />
                {compoundingPercent}%
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-1">Saved</p>
            <p className="text-xl font-bold text-purple-400">${saved.toFixed(2)}</p>
            {showCompoundingEdit && (
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={compoundingPercent}
                    onChange={(e) => setCompoundingPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-purple-500/30 rounded px-2 py-1 text-xs text-white"
                    min={0}
                    max={100}
                    step={5}
                    onBlur={() => setShowCompoundingEdit(false)}
                    autoFocus
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">% of profits to save</p>
              </div>
            )}
          </div>
          
          {/* Today P&L */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Clock size={18} className="text-indigo-400" />
              <span className="text-xs text-gray-500">24H</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Today P&L</p>
            <p className={`text-xl font-bold ${todayPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {todayPL >= 0 ? '+' : ''}${Math.abs(todayPL).toFixed(2)}
            </p>
          </div>
          
          {/* Total Trades */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Activity size={18} className="text-orange-400" />
              <span className="text-xs text-gray-500">ALL</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Trades</p>
            <p className="text-xl font-bold text-orange-400">{stats.total}</p>
          </div>
          
          {/* Total P&L */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={18} className="text-cyan-400" />
              <span className="text-xs text-gray-500">ROI</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Total P&L</p>
            <p className={`text-xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}${Math.abs(totalPL).toFixed(2)}
            </p>
          </div>
          
          {/* ROI */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Target size={18} className="text-pink-400" />
              <span className="text-xs text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Return</p>
            <p className={`text-xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {capital > 0 ? ((totalPL / capital) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>
        </div>
        
        {/* Critical Market News */}
        <div className="mb-6 bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              Critical Market News
            </h3>
            <span className="text-xs text-gray-400 bg-red-500/10 px-2 py-1 rounded-full">LIVE</span>
          </div>
          <div className="space-y-3">
            <div className="bg-black/40 rounded-xl p-3 border-l-4 border-red-400">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white mb-1">Fed Interest Rate Decision Pending</p>
                  <p className="text-xs text-gray-400">Markets volatile ahead of FOMC announcement • 2 hours ago</p>
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">HIGH</span>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border-l-4 border-yellow-400">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white mb-1">Major Bank Earnings This Week</p>
                  <p className="text-xs text-gray-400">JPM, BAC, WFC reporting • Could impact financials sector • 6 hours ago</p>
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">MED</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Trade Button */}
        <button
          onClick={() => setShowAddTrade(true)}
          className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/20"
        >
          <div className="p-2 bg-white/10 rounded-lg">
            <Plus size={20} />
          </div>
          New Trade Entry
        </button>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Trades */}
          <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <BarChart3 size={20} className="text-cyan-400" />
                Trade Stream
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">LIVE</span>
              </div>
            </div>
            
            {trades.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <Activity size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-500">No trades recorded yet</p>
                <p className="text-sm text-gray-600 mt-2">Click "New Trade Entry" to start tracking</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {trades.slice(-10).reverse().map((trade) => (
                  <div key={trade.id} className="bg-black/40 rounded-2xl p-4 flex justify-between items-center hover:bg-black/60 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-1 h-12 rounded-full ${trade.profit >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{trade.instrument}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            trade.type === 'BUY' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                          <span className="text-xs text-gray-500">{trade.lot_size} lot</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {trade.instructor} • {new Date(trade.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                      </p>
                      {trade.pips > 0 && (
                        <p className="text-xs text-gray-400">{trade.pips.toFixed(1)} pips</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Instructor Performance */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
              <Users size={20} className="text-purple-400" />
              Instructor Analytics
            </h2>
            
            {instructorStats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No instructor data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {instructorStats.map((stat, index) => (
                  <div key={stat.instructor} className="bg-black/40 rounded-2xl p-4 hover:bg-black/60 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <p className="font-medium text-white">{stat.instructor}</p>
                      </div>
                      <p className={`font-bold ${stat.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.profit >= 0 ? '+' : ''}${stat.profit.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{stat.trades} trades</span>
                      <span>{stat.winRate}% win</span>
                      {stat.pips > 0 && <span>{stat.pips.toFixed(1)} pips</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 mt-12 px-6 pb-6">
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-800">
          <div className="text-center space-y-4">
            {/* Legal Disclaimer */}
            <div className="text-xs text-gray-400 max-w-4xl mx-auto leading-relaxed">
              <p className="mb-2">
                <span className="text-yellow-400 font-semibold">⚠️ DISCLAIMER:</span> This application is a trading journal tool for educational and record-keeping purposes only. 
                It is NOT financial advice, investment recommendation, or trading guidance. All trading decisions are your own responsibility. 
                Past performance does not guarantee future results. Trading involves substantial risk of loss.
              </p>
            </div>
            
            {/* Company Attribution */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm font-semibold text-gray-300">Made by</p>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    SM INTERNATIONAL LLC
                  </p>
                  <p className="text-xs text-gray-400">FLORIDA, USA</p>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-sm font-semibold text-gray-300">Contributions & Ideas by</p>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    KRISTIJAN STAVRESKI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Support Ticket Modal */}
      {showSupportTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-blue-500/20 rounded-3xl p-8 w-full max-w-lg shadow-2xl shadow-blue-500/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                Support Ticket
              </h2>
              <button 
                onClick={() => setShowSupportTicket(false)} 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2">Name *</label>
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2">Email *</label>
                  <input
                    type="email"
                    className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2">Issue Type</label>
                <select className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all">
                  <option value="">Select issue type...</option>
                  <option value="bug">🐛 Bug Report</option>
                  <option value="feature">✨ Feature Request</option>
                  <option value="support">🎧 General Support</option>
                  <option value="account">👤 Account Issue</option>
                  <option value="data">📊 Data/Calculation Issue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 px-3 rounded-lg border border-green-500/30 text-green-400 text-sm hover:bg-green-500/10 transition-all">
                    Low
                  </button>
                  <button className="py-2 px-3 rounded-lg border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-500/10 transition-all">
                    Medium
                  </button>
                  <button className="py-2 px-3 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all">
                    High
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2">Subject *</label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all"
                  placeholder="Brief description of the issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2">Description *</label>
                <textarea
                  rows={4}
                  className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all resize-none"
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if it's a bug..."
                ></textarea>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-xs text-blue-400 mb-2">📋 System Information (automatically included):</p>
                <p className="text-xs text-gray-400">Browser: Chrome • OS: Unknown • App Version: 1.0</p>
              </div>
              
              <button
                onClick={() => {
                  alert('Support ticket submitted! We\'ll get back to you within 24 hours.');
                  setShowSupportTicket(false);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Trade Form Modal */}
      <AddTradeForm 
        showAddTrade={showAddTrade}
        setShowAddTrade={setShowAddTrade}
        remainingAllowance={remainingAllowance} 
        maxLotSize={maxLotSize}
        trades={trades}
        setTrades={setTrades}
        compoundingPercent={compoundingPercent}
        user={user}
      />
    </div>
  );
};

// Main App Component with Navigation
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: Session | null) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (currentPage === 'landing' && !user) {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'login' && !user) {
    return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  if (currentPage === 'register' && !user) {
    return <RegisterPage onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  if (user) {
    return <TradingDashboard user={user} onLogout={handleLogout} />;
  }

  return <LandingPage onNavigate={handleNavigate} />;
}