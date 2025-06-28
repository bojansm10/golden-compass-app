'use client';

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
        
        {/* Motivational Quote Section */}
        <div className="mb-6 relative overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 rounded-3xl p-4 md:p-8 border border-purple-500/20 text-center">
            <div className="absolute top-4 left-8 text-6xl text-purple-400/20 font-serif">"</div>
            <div className="absolute bottom-4 right-8 text-6xl text-purple-400/20 font-serif transform rotate-180">"</div>
            <div className="relative z-10">
              <blockquote className="text-base md:text-xl lg:text-2xl font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-4 leading-relaxed tracking-wide" style={{fontFamily: "'Playfair Display', 'Georgia', serif", fontStyle: 'italic', letterSpacing: '0.02em'}}>
                The market is a device for transferring money from the impatient to the patient. Master your emotions, follow your strategy, and let time be your greatest ally.
              </blockquote>
              <cite className="text-sm text-purple-400/80 font-medium tracking-widest uppercase" style={{fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em'}}>
                — Golden Compass Wisdom
              </cite>
            </div>
          </div>
        </div>
        
        {/* Account Health Oscillator */}
        <div className="mb-6 bg-gray-900/80 rounded-3xl p-4 md:p-6 border border-gray-800 relative overflow-hidden">
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
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
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
        
        {/* Add Trade Button */}
        <button
          onClick={() => setShowAddTrade(true)}
          className="mb-6 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 md:px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-500/20"
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
      {showSupportTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-blue-500/20 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl shadow-blue-500/10 max-h-[90vh] overflow-y-auto">
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
