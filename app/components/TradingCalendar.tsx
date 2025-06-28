// components/TradingCalendar.tsx
'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, Flame, Trophy, Calendar, ChevronDown, ChevronUp, Activity, BarChart3, CalendarDays } from 'lucide-react';

interface Trade {
  id: string;
  created_at: string;
  profit: number;
  instrument: string;
  type: string;
  instructor: string;
  pips?: number;
}

interface TradingCalendarProps {
  trades: Trade[];
  startingCapital?: number;
  pipValue?: number;
}

const TradingCalendar: React.FC<TradingCalendarProps> = ({ trades = [], startingCapital = 10000, pipValue = 10 }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedSections, setExpandedSections] = useState({
    progress: true,
    stats: false,
    calendar: false
  });
  
  // Daily goal is 80 pips from starting capital
  const DAILY_PIP_TARGET = 80;
  const DAILY_GOAL = (startingCapital * 0.008); // 80 pips = 0.8% of capital
  
  const today = new Date();
  const todayStr = today.toDateString();
  
  // Today's stats
  const todayTrades = trades.filter(trade => 
    new Date(trade.created_at).toDateString() === todayStr
  );
  const todayPL = todayTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const todayPips = todayTrades.reduce((sum, trade) => sum + (trade.pips || 0), 0);
  
  // Week stats
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.created_at);
    return tradeDate >= weekStart && tradeDate <= today;
  });
  const weekPL = weekTrades.reduce((sum, trade) => sum + trade.profit, 0);
  
  // Month stats
  const monthTrades = trades.filter(trade => {
    const d = new Date(trade.created_at);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const monthPL = monthTrades.reduce((sum, t) => sum + t.profit, 0);
  
  // Calculate streaks
  const getStreak = () => {
    let streak = 0;
    const sortedDates = [...new Set(trades.map(t => 
      new Date(t.created_at).toDateString()
    ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    for (const dateStr of sortedDates) {
      const dayTrades = trades.filter(t => 
        new Date(t.created_at).toDateString() === dateStr
      );
      const dayPL = dayTrades.reduce((sum, t) => sum + t.profit, 0);
      if (dayPL >= DAILY_GOAL) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };
  
  const currentStreak = getStreak();
  const goalProgress = Math.min((todayPL / DAILY_GOAL) * 100, 100);
  const pipProgress = Math.min((todayPips / DAILY_PIP_TARGET) * 100, 100);
  
  // Mini calendar days
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startDay = new Date(firstDay);
  startDay.setDate(firstDay.getDate() - firstDay.getDay());
  
  const days: Date[] = [];
  for (let i = 0; i < 35; i++) {
    const day = new Date(startDay);
    day.setDate(startDay.getDate() + i);
    days.push(day);
  }
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Calendar size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Daily Performance</h3>
              <p className="text-sm text-gray-400">
                {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${todayPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${todayPL.toFixed(0)}
            </div>
            <p className="text-xs text-gray-500 text-right">Today's P&L</p>
          </div>
        </div>
      </div>
      
      {/* Today's Progress Section */}
      <div className="border-b border-gray-700">
        <button
          onClick={() => toggleSection('progress')}
          className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-purple-400" />
            <span className="font-medium text-white">Today's Progress</span>
          </div>
          {expandedSections.progress ? 
            <ChevronUp size={20} className="text-gray-400" /> : 
            <ChevronDown size={20} className="text-gray-400" />
          }
        </button>
        
        {expandedSections.progress && (
          <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-2">
            {/* Profit Goal Progress */}
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">Daily Profit Goal</span>
                  <span className="text-xs text-gray-500">(80 pips)</span>
                </div>
                <span className={`text-lg font-bold ${todayPL >= DAILY_GOAL ? 'text-emerald-400' : 'text-white'}`}>
                  ${todayPL.toFixed(0)} / ${DAILY_GOAL.toFixed(0)}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-950 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-500 ${
                    goalProgress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 
                    goalProgress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    'bg-gradient-to-r from-red-400 to-pink-500'
                  }`}
                  style={{width: `${goalProgress}%`}}
                />
                {goalProgress >= 100 && (
                  <Trophy size={14} className="absolute right-2 top-1 text-yellow-300 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{goalProgress.toFixed(0)}% Complete • Capital: ${startingCapital.toLocaleString()}</p>
            </div>
            
            {/* Pip Target Progress */}
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Daily Pip Target</span>
                </div>
                <span className={`text-lg font-bold ${todayPips >= DAILY_PIP_TARGET ? 'text-purple-400' : 'text-white'}`}>
                  {todayPips.toFixed(0)} / {DAILY_PIP_TARGET}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500"
                  style={{width: `${pipProgress}%`}}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{pipProgress.toFixed(0)}% Complete</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Grid Section */}
      <div className="border-b border-gray-700">
        <button
          onClick={() => toggleSection('stats')}
          className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-green-400" />
            <span className="font-medium text-white">Performance Stats</span>
            <span className="text-xs text-gray-500 ml-2">Click to expand</span>
          </div>
          {expandedSections.stats ? 
            <ChevronUp size={20} className="text-gray-400" /> : 
            <ChevronDown size={20} className="text-gray-400" />
          }
        </button>
        
        {expandedSections.stats && (
          <div className="px-5 pb-5 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Today's Trades</div>
                <div className="text-2xl font-bold text-white">{todayTrades.length}</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Week P&L</div>
                <div className={`text-2xl font-bold ${weekPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${Math.abs(weekPL) >= 1000 ? `${(weekPL/1000).toFixed(1)}k` : weekPL.toFixed(0)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Month P&L</div>
                <div className={`text-2xl font-bold ${monthPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${Math.abs(monthPL) >= 1000 ? `${(monthPL/1000).toFixed(1)}k` : monthPL.toFixed(0)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <Flame size={12} className="text-orange-400" />
                  Win Streak
                </div>
                <div className="text-2xl font-bold text-orange-400">{currentStreak} days</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mini Calendar Section */}
      <div>
        <button
          onClick={() => toggleSection('calendar')}
          className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-400" />
            <span className="font-medium text-white">Monthly Calendar</span>
            <span className="text-xs text-gray-500 ml-2">View monthly performance</span>
          </div>
          {expandedSections.calendar ? 
            <ChevronUp size={20} className="text-gray-400" /> : 
            <ChevronDown size={20} className="text-gray-400" />
          }
        </button>
        
        {expandedSections.calendar && (
          <div className="p-5 animate-in slide-in-from-top-2">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-center text-sm font-medium text-gray-300 mb-3">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs text-gray-500 text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((date, i) => {
                  const dayTrades = trades.filter(t => 
                    new Date(t.created_at).toDateString() === date.toDateString()
                  );
                  const dayPL = dayTrades.reduce((sum, t) => sum + t.profit, 0);
                  const isToday = date.toDateString() === todayStr;
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const hitGoal = dayPL >= DAILY_GOAL;
                  
                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg text-xs relative
                        transition-all cursor-pointer hover:scale-105
                        ${!isCurrentMonth ? 'opacity-30' : ''}
                        ${isToday ? 'ring-2 ring-cyan-500 bg-cyan-500/20 shadow-lg' : ''}
                        ${hitGoal && !isToday ? 'bg-emerald-500/20 border border-emerald-500/30' : ''}
                        ${dayPL < 0 && !isToday ? 'bg-red-500/20 border border-red-500/30' : ''}
                        ${!hitGoal && dayPL === 0 && !isToday && isCurrentMonth ? 'bg-gray-800 border border-gray-700' : ''}
                      `}
                    >
                      <span className={`
                        font-medium
                        ${isToday ? 'text-cyan-300 font-bold' : 
                          hitGoal ? 'text-emerald-400' :
                          dayPL < 0 ? 'text-red-400' :
                          isCurrentMonth ? 'text-gray-300' : 'text-gray-600'}
                      `}>
                        {date.getDate()}
                      </span>
                      {hitGoal && !isToday && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Calendar Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500/20 border border-emerald-500/30 rounded" />
                  <span className="text-gray-400">Goal Hit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded" />
                  <span className="text-gray-400">Loss Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg" />
                  <span className="text-gray-400">Perfect Day</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingCalendar;
