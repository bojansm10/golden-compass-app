// components/TradingCalendar.tsx
'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, Flame, Trophy, Calendar } from 'lucide-react';

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
}

const TradingCalendar: React.FC<TradingCalendarProps> = ({ trades }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const DAILY_GOAL = 500; // Daily profit goal
  const DAILY_PIP_TARGET = 50; // Daily pip target
  
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
  
  return (
    <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4">
      {/* Header with Calendar Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-cyan-400" />
          <h3 className="text-sm font-medium text-gray-300">Daily Performance</h3>
        </div>
        <div className="text-xs text-gray-500">
          {today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      {/* Today's Progress Bars */}
      <div className="space-y-3 mb-4">
        {/* Profit Goal Progress */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-yellow-400" />
              <span className="text-xs text-gray-400">Daily Goal</span>
            </div>
            <span className={`text-sm font-bold ${todayPL >= DAILY_GOAL ? 'text-emerald-400' : 'text-white'}`}>
              ${todayPL.toFixed(0)} / ${DAILY_GOAL}
            </span>
          </div>
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-500 ${
                goalProgress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 
                goalProgress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-red-400 to-pink-500'
              }`}
              style={{width: `${goalProgress}%`}}
            />
            {goalProgress >= 100 && (
              <Trophy size={12} className="absolute right-2 top-0.5 text-yellow-300 animate-pulse" />
            )}
          </div>
        </div>
        
        {/* Pip Target Progress */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-purple-400" />
              <span className="text-xs text-gray-400">Pip Target</span>
            </div>
            <span className={`text-sm font-bold ${todayPips >= DAILY_PIP_TARGET ? 'text-purple-400' : 'text-white'}`}>
              {todayPips.toFixed(0)} / {DAILY_PIP_TARGET}
            </span>
          </div>
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500"
              style={{width: `${pipProgress}%`}}
            />
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-black/40 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-500">Trades</div>
          <div className="text-lg font-bold text-white">{todayTrades.length}</div>
        </div>
        <div className="bg-black/40 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-500">Week</div>
          <div className={`text-lg font-bold ${weekPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${Math.abs(weekPL) >= 1000 ? `${(weekPL/1000).toFixed(1)}k` : weekPL.toFixed(0)}
          </div>
        </div>
        <div className="bg-black/40 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-500">Month</div>
          <div className={`text-lg font-bold ${monthPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${Math.abs(monthPL) >= 1000 ? `${(monthPL/1000).toFixed(1)}k` : monthPL.toFixed(0)}
          </div>
        </div>
        <div className="bg-black/40 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Flame size={10} className="text-orange-400" />
            Streak
          </div>
          <div className="text-lg font-bold text-orange-400">{currentStreak}d</div>
        </div>
      </div>
      
      {/* Mini Calendar */}
      <div className="bg-black/20 rounded-xl p-2">
        <div className="text-center text-xs text-gray-500 mb-2">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-1">
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
                  aspect-square flex items-center justify-center rounded text-[10px] relative
                  ${!isCurrentMonth ? 'opacity-20' : ''}
                  ${isToday ? 'ring-2 ring-cyan-500 bg-cyan-500/20' : ''}
                  ${hitGoal && !isToday ? 'bg-emerald-500/20' : ''}
                  ${dayPL < 0 && !isToday ? 'bg-red-500/10' : ''}
                `}
              >
                <span className={`
                  ${isToday ? 'text-cyan-400 font-bold' : 
                    hitGoal ? 'text-emerald-400' :
                    dayPL < 0 ? 'text-red-400' :
                    'text-gray-600'}
                `}>
                  {date.getDate()}
                </span>
                {hitGoal && !isToday && (
                  <div className="absolute -top-0.5 -right-0.5">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Calendar Legend */}
        <div className="flex items-center justify-center gap-3 mt-2 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-500/20 rounded" />
            <span className="text-gray-500">Goal Hit</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
            <span className="text-gray-500">Perfect Day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingCalendar;
