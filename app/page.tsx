'use client';

import MotivationalQuote from './components/MotivationalQuote';
import AccountHealthMonitor from './components/AccountHealthMonitor';
import SupportTicketModal from './components/SupportTicketModal';
import CompoundVision from './components/CompoundVision'; // NEW IMPORT
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Plus, X, DollarSign, TrendingUp, AlertTriangle, Award, Clock, Activity, Users, Zap, Shield, Target, BarChart3, Sparkles, ChevronUp, ChevronDown, Brain, Flame, Settings, ArrowRight, Eye, EyeOff, Mail, Lock, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import TradingCalendar from './components/TradingCalendar';
import RegisterPage from './components/RegisterPage';
import AddTradeForm from './components/AddTradeForm';

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
  const [showCompoundVision, setShowCompoundVision] = useState(true); // NEW STATE FOR COMPOUND VISION
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
  const maxLotSize = parseFloat((available / 100 * 0.01).toFixed(2));
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
      {/* Simplified Background for Better Performance */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900"></div>
      </div>
      
      <div className="relative z-10 p-3 md:p-6">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 md:gap-4">
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
                <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
                  Golden Compass
                </h1>
                <h2 className="text-sm md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 mb-1 md:mb-2">
                  Trading Command Center
                </h2>
                <p className="text-gray-400 flex items-center gap-2 text-xs md:text-base">
                  <Brain size={14} className="text-cyan-400 md:w-4 md:h-4" />
                  Welcome back, {user.user_metadata?.name || user.email}
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto md:text-right">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {/* NEW: Compound Vision Toggle Button */}
                <button
                  onClick={() => setShowCompoundVision(!showCompoundVision)}
                  className={`flex items-center gap-1 md:gap-2 text-xs px-2 md:px-3 py-1 rounded-full transition-all ${
                    showCompoundVision 
                      ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>💎</span>
                  <span className="hidden sm:inline">Wealth Vision</span>
                </button>
                
                <button
                  onClick={() => setShowQuickSettings(!showQuickSettings)}
                  className="flex items-center gap-1 md:gap-2 text-xs px-2 md:px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all"
                >
                  <Settings size={12} className="md:w-3.5 md:h-3.5" />
                  <span className="hidden sm:inline">Quick</span> Settings
                </button>
                <button
                  onClick={() => setShowSupportTicket(true)}
                  className="flex items-center gap-1 md:gap-2 text-xs px-2 md:px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-all"
                >
                  <span>🎧</span>
                  <span className="hidden sm:inline">Support</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 md:gap-2 text-xs px-2 md:px-3 py-1 bg-red-600 hover:bg-red-500 rounded-full text-white transition-all"
                >
                  <LogOut size={12} className="md:w-3.5 md:h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-2">
                <p>Risk Protocol: {riskPercent}% Daily</p>
                <p className="hidden sm:block">Position Sizing: 0.01 lot / $100</p>
                <p>Compounding: {compoundingPercent}%</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Motivational Quote */}
        <MotivationalQuote />
        
        {/* Quick Settings Panel */}
        {showQuickSettings && (
          <div className="mb-6 bg-gray-900/40 rounded-2xl p-3 md:p-4 border border-gray-800">
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
                <label className="text-xs text-gray-400 mb-1 block">Starting Capital</label>
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
        
        {/* Account Health Monitor */}
        <AccountHealthMonitor 
          stats={stats}
          riskUsed={riskUsed}
          totalPL={totalPL}
          capital={capital}
          todayPL={todayPL}
        />
        
        {/* NEW: Compound Vision Section - Strategically placed for maximum motivational impact */}
        {showCompoundVision && (
          <div className="mb-6">
            <CompoundVision 
              trades={trades}
              capital={capital}
              compoundingPercent={compoundingPercent}
              riskPercent={riskPercent}
            />
          </div>
        )}
        
        {/* Add Trade Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowAddTrade(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 md:px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 group"
          >
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
              <Plus size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="text-base md:text-lg font-bold">New Trade Entry</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </button>
        </div>
        
        {/* Trading Calendar */}
        <div className="mb-6">
          <TradingCalendar 
            trades={trades} 
            startingCapital={capital}
            dailyGoal={capital * (riskPercent / 100)}
          />
        </div>
        
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Capital Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gray-900/90 rounded-3xl p-4 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
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
              <p className="text-sm text-gray-400 mb-2">Starting Capital</p>
              <p className="text-xl md:text-3xl font-bold text-white">${capital.toLocaleString()}</p>
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
                  <p className="text-xs text-gray-500 mt-1">Your initial investment amount</p>
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
              <p className="text-xl md:text-3xl font-bold text-white">${available.toFixed(2)}</p>
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
              <p className="text-xl md:text-3xl font-bold text-white">${dailyLimit.toFixed(2)}</p>
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
              <p className="text-xl md:text-3xl font-bold text-white">{stats.winRate.toFixed(1)}%</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
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
            <p className="text-lg md:text-xl font-bold text-purple-400">${saved.toFixed(2)}</p>
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
            <p className={`text-lg md:text-xl font-bold ${todayPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
            <p className="text-lg md:text-xl font-bold text-orange-400">{stats.total}</p>
          </div>
          
          {/* Total P&L */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={18} className="text-cyan-400" />
              <span className="text-xs text-gray-500">ROI</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Total P&L</p>
            <p className={`text-lg md:text-xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
            <p className={`text-lg md:text-xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {capital > 0 ? ((totalPL / capital) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>
        </div>
        
        {/* Critical Market News */}
        <div className="mb-6 bg-gray-900/60 rounded-2xl p-3 md:p-4 border border-gray-800">
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
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Trades */}
          <div className="lg:col-span-2 bg-gray-900/60 rounded-3xl border border-gray-800 p-4 md:p-6">
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
                  <div key={trade.id} className="bg-black/40 rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-black/60 transition-all gap-2 sm:gap-0">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-1 h-10 md:h-12 rounded-full ${trade.profit >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white text-sm md:text-base">{trade.instrument}</p>
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
                    <div className="text-right ml-auto sm:ml-0">
                      <p className={`font-bold text-base md:text-lg ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
          <div className="bg-gray-900/60 rounded-3xl border border-gray-800 p-4 md:p-6">
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
                  <div key={stat.instructor} className="bg-black/40 rounded-2xl p-3 md:p-4 hover:bg-black/60 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <p className="font-medium text-white text-sm md:text-base">{stat.instructor}</p>
                      </div>
                      <p className={`font-bold text-sm md:text-base ${stat.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
      <footer className="relative z-10 mt-12 px-3 md:px-6 pb-6">
        <div className="bg-gray-900/60 rounded-2xl p-4 md:p-6 border border-gray-800">
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
      <SupportTicketModal 
        showSupportTicket={showSupportTicket}
        setShowSupportTicket={setShowSupportTicket}
      />
      
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
