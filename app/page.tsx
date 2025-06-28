'use client';

import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Plus, X, DollarSign, TrendingUp, AlertTriangle, Award, Clock, Activity, Users, Zap, Shield, Target, BarChart3, Sparkles, ChevronUp, ChevronDown, Brain, Flame, Settings, ArrowRight, Eye, EyeOff, Mail, Lock, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import TradingCalendar from './components/TradingCalendar';
import RegisterPage from './components/RegisterPage';
// ✅ ADDED: Import the extracted AddTradeForm component
import AddTradeForm from './components/AddTradeForm';

// ❌ REMOVED: The entire AddTradeForm component definition (~400 lines) - now imported above

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
      console.log('User object:', user);
      console.log('User ID:', getUserId(user));
      
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
      }
      setLoading(false);
    };
    
    loadSettings();
  }, [user]);
  
  // Load trades
  useEffect(() => {
    const loadTrades = async () => {
      const userId = getUserId(user);
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (data) {
        setTrades(data);
      }
    };
    
    loadTrades();
  }, [user]);
  
  // Save settings function
  const saveSettings = async () => {
    const userId = getUserId(user);
    if (!userId) {
      console.error('No user ID found, cannot save settings');
      return;
    }
    
    console.log('Saving settings:', { capital, riskPercent, compoundingPercent });
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        capital: capital,
        risk_percent: riskPercent,
        compounding_percent: compoundingPercent
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings: ' + error.message);
    } else {
      console.log('Settings saved successfully');
      
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
                  </svg>
                </div>
              </div>
              
              {/* App Title and User Info */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Golden Compass
                </h1>
                <p className="text-xs md:text-sm text-gray-400">
                  Welcome back, {user?.user_metadata?.name || user?.email || 'Trader'}
                </p>
              </div>
              
              {/* Live Balance */}
              <div className="hidden lg:flex items-center gap-4 ml-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="text-lg font-bold text-white">${(capital + totalPL).toLocaleString()}</p>
                  <span className={`text-sm ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalPL > 0 ? '+' : ''}{totalPL.toFixed(0)}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Total P&L</p>
                  <span className={`text-lg font-bold ${
                    capital > 0 ? ((totalPL / capital) * 100 >= 0 ? 'text-green-400' : 'text-red-400') : 'text-gray-400'
                  }`}>
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
            
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQuickSettings(!showQuickSettings)}
                  className="flex items-center gap-1 md:gap-2 text-xs px-2 md:px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-all"
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
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Trading Capital</label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Daily Risk %</label>
                <input
                  type="number"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Compounding %</label>
                <input
                  type="number"
                  value={compoundingPercent}
                  onChange={(e) => setCompoundingPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <button
              onClick={() => {
                saveSettings();
                setShowQuickSettings(false);
              }}
              className="mt-3 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-2 rounded-lg font-medium transition-all"
            >
              Apply Changes
            </button>
          </div>
        )}
        
        <div className="mb-6">
          <TradingCalendar trades={trades} />
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
              {showRiskEdit && (
                <div className="mt-3">
                  <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-white"
                    onBlur={() => setShowRiskEdit(false)}
                    autoFocus
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage of capital at risk per day</p>
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
                <input
                  type="number"
                  value={compoundingPercent}
                  onChange={(e) => setCompoundingPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-white"
                  onBlur={() => setShowCompoundingEdit(false)}
                  autoFocus
                  min="0"
                  max="100"
                />
              </div>
            )}
          </div>
          
          {/* Today P&L */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Clock size={18} className="text-cyan-400" />
              <span className="text-xs text-gray-400">24h</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Today P&L</p>
            <p className={`text-lg md:text-xl font-bold ${todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {todayPL >= 0 ? '+' : ''}${todayPL.toFixed(2)}
            </p>
          </div>
          
          {/* Total Trades */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Activity size={18} className="text-blue-400" />
              <span className="text-xs text-gray-400">ALL</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Total Trades</p>
            <p className="text-lg md:text-xl font-bold text-white">{stats.total}</p>
          </div>
          
          {/* Remaining Allowance */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Target size={18} className="text-orange-400" />
              <span className="text-xs text-gray-400">LEFT</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Risk Allowance</p>
            <p className="text-lg md:text-xl font-bold text-orange-400">${remainingAllowance.toFixed(2)}</p>
          </div>
          
          {/* Total P&L */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={18} className="text-green-400" />
              <span className="text-xs text-gray-400">NET</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Total P&L</p>
            <p className={`text-lg md:text-xl font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* New Trade Button */}
        <button
          onClick={() => setShowAddTrade(true)}
          className="w-full mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-3xl p-4 flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-500/20"
        >
          <div className="p-2 bg-white/10 rounded-lg">
            <Plus size={18} className="md:w-5 md:h-5" />
          </div>
          <span className="text-sm md:text-base">New Trade Entry</span>
        </button>
        
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
          
          {/* Performance Sidebar */}
          <div className="space-y-6">
            {/* Account Health Oscillator */}
            <div className="bg-gray-900/60 rounded-3xl border border-gray-800 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
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
                      
                      if (healthScore >= 80) return 'bg-green-500/20';
                      if (healthScore >= 60) return 'bg-yellow-500/20';
                      if (healthScore >= 40) return 'bg-orange-500/20';
                      return 'bg-red-500/20';
                    })()
                  }`}>
                    <div className={`text-lg ${
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
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Account Health Monitor</h2>
                  <p className="text-sm text-gray-400">Live performance oscillator</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl md:text-3xl font-bold ${
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
                    
                    const amplitude = Math.max(5, healthScore * 0.3);
                    const frequency = Math.max(0.8, healthScore * 0.02);
                    
                    let path = `M 0 40`;
                    for (let x = 0; x <= 800; x += 10) {
                      const y = 40 + Math.sin(x * frequency * 0.01) * amplitude;
                      path += ` L ${x} ${y}`;
                    }
                    return path;
                  })()}
                  fill="none"
                  stroke="rgba(34, 197, 94, 0.8)"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-center mt-2">
                <span className={`text-sm font-mono ${
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
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                          index === 2 ? 'bg-gradient-to-br from-yellow-600 to-yellow-800' : 'bg-gray-700'
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
              <p className="text-gray-500">
                Always consult with a qualified financial advisor before making investment decisions. The creators of this application are not responsible for any trading losses or gains.
              </p>
            </div>
            
            {/* App Info */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Golden Compass Trading Journal v1.0 • 
                <span className="text-cyan-400"> Professional Trading Analytics</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Support Ticket Modal */}
      {showSupportTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-blue-500/20 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl shadow-blue-500/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                Support Request
              </h2>
              <button 
                onClick={() => setShowSupportTicket(false)} 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
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
      
      {/* ✅ UPDATED: Use the extracted AddTradeForm component */}
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
