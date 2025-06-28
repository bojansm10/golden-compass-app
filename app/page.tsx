'use client';

import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Plus, X, DollarSign, TrendingUp, AlertTriangle, Award, Clock, Activity, Users, Zap, Shield, Target, BarChart3, Sparkles, ChevronUp, ChevronDown, Brain, Flame, Settings, ArrowRight, Eye, EyeOff, Mail, Lock, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import TradingCalendar from './components/TradingCalendar';
import RegisterPage from './components/RegisterPage';
// ✅ NEW: Import the extracted AddTradeForm component
import AddTradeForm from './components/AddTradeForm';

// ❌ REMOVED: The entire AddTradeForm component definition (400+ lines) has been extracted!

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
  
  // Update settings in database
  const updateSetting = async (field: string, value: number) => {
    const userId = getUserId(user);
    if (!userId) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', userId);
    
    if (error) {
      console.error('Failed to update setting:', error);
    }
  };
  
  // Calculate metrics
  const totalPL = trades.reduce((sum, trade) => sum + trade.profit, 0);
  const today = new Date().toDateString();
  const todayTrades = trades.filter(trade => new Date(trade.created_at).toDateString() === today);
  const todayPL = todayTrades.reduce((sum, trade) => sum + trade.profit, 0);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyTrades = trades.filter(trade => new Date(trade.created_at) >= weekAgo);
  const weeklyPL = weeklyTrades.reduce((sum, trade) => sum + trade.profit, 0);
  
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const monthlyTrades = trades.filter(trade => new Date(trade.created_at) >= monthAgo);
  const monthlyPL = monthlyTrades.reduce((sum, trade) => sum + trade.profit, 0);
  
  const winningTrades = trades.filter(trade => trade.profit > 0);
  const losingTrades = trades.filter(trade => trade.profit < 0);
  const stats = {
    wins: winningTrades.length,
    losses: losingTrades.length,
    winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
    totalTrades: trades.length
  };
  
  // Risk calculations
  const dailyLimit = (capital * riskPercent) / 100;
  const available = Math.max(0, capital + totalPL);
  const saved = (totalPL * compoundingPercent) / 100;
  const remainingAllowance = Math.max(0, dailyLimit + todayPL);
  const maxLotSize = remainingAllowance / 100;
  const riskUsed = todayPL < 0 ? (Math.abs(todayPL) / dailyLimit) * 100 : 0;

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
                  onChange={(e) => {
                    const newCapital = parseFloat(e.target.value) || 0;
                    setCapital(newCapital);
                    updateSetting('capital', newCapital);
                  }}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Daily Risk %</label>
                <input
                  type="number"
                  value={riskPercent}
                  onChange={(e) => {
                    const newRisk = parseFloat(e.target.value) || 0;
                    setRiskPercent(newRisk);
                    updateSetting('risk_percent', newRisk);
                  }}
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
                  onChange={(e) => {
                    const newCompounding = parseFloat(e.target.value) || 0;
                    setCompoundingPercent(newCompounding);
                    updateSetting('compounding_percent', newCompounding);
                  }}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowQuickSettings(false)}
              className="mt-3 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-2 rounded-lg font-medium transition-all"
            >
              Apply Changes
            </button>
          </div>
        )}
        
        <div className="mb-6">
          <TradingCalendar trades={trades} />
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
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{trade.instructor}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(trade.created_at).toLocaleDateString()} • 
                          {trade.lot_size} lots
                          {trade.pips && ` • ${trade.pips > 0 ? '+' : ''}${trade.pips.toFixed(1)} pips`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm md:text-lg ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Performance Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-gray-900/60 rounded-3xl border border-gray-800 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Award size={18} className="text-yellow-400" />
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-emerald-400 font-semibold">{stats.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="text-white font-semibold">{stats.totalTrades}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Weekly P&L</span>
                  <span className={`font-semibold ${weeklyPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {weeklyPL >= 0 ? '+' : ''}${weeklyPL.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Monthly P&L</span>
                  <span className={`font-semibold ${monthlyPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {monthlyPL >= 0 ? '+' : ''}${monthlyPL.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Risk Monitor */}
            <div className="bg-gray-900/60 rounded-3xl border border-gray-800 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Shield size={18} className="text-cyan-400" />
                Risk Monitor
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Daily Limit</span>
                  <span className="text-white font-semibold">${dailyLimit.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Risk Used</span>
                  <span className={`font-semibold ${riskUsed > 80 ? 'text-red-400' : riskUsed > 50 ? 'text-orange-400' : 'text-green-400'}`}>
                    {riskUsed.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Max Lot Size</span>
                  <span className="text-white font-semibold">{maxLotSize.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
      </div>

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
