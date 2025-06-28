// components/TradingCalendar.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [showDetails, setShowDetails] = useState(false);
  
  const today = new Date();
  const todayStr = today.toDateString();
  
  // Get today's trades
  const todayTrades = trades.filter(trade => 
    new Date(trade.created_at).toDateString() === todayStr
  );
  const todayPL = todayTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const todayPips = todayTrades.reduce((sum, trade) => sum + (trade.pips || 0), 0);
  
  // Get first day of month
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDay = new Date(firstDay);
  startDay.setDate(firstDay.getDate() - firstDay.getDay());
  
  // Generate days
  const days: Date[] = [];
  const current = new Date(startDay);
  while (current <= lastDay || current.getDay() !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  // Get day stats
  const getDayPL = (date: Date) => {
    const dayTrades = trades.filter(t => 
      new Date(t.created_at).toDateString() === date.toDateString()
    );
    return dayTrades.reduce((sum, t) => sum + t.profit, 0);
  };
  
  // Month stats
  const monthTrades = trades.filter(trade => {
    const d = new Date(trade.created_at);
    return d.getMonth() === currentMonth.getMonth() && 
           d.getFullYear() === currentMonth.getFullYear();
  });
  const monthPL = monthTrades.reduce((sum, t) => sum + t.profit, 0);
  
  return (
    <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-3">
      {/* Today's Performance - Always Visible */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-400">Today</span>
            <div className={`text-xl font-bold ${todayPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {todayPL >= 0 ? '+' : ''}${Math.abs(todayPL).toFixed(2)}
            </div>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Trades</span>
            <div className="text-lg font-bold text-white">{todayTrades.length}</div>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Pips</span>
            <div className="text-lg font-bold text-purple-400">{todayPips.toFixed(0)}</div>
          </div>
        </div>
        
        {/* Toggle Calendar Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-all"
        >
          {showDetails ? 'Hide' : 'Show'} Calendar
        </button>
      </div>
      
      {/* Expandable Calendar Section */}
      {showDetails && (
        <div className="space-y-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() - 1);
                setCurrentMonth(newMonth);
              }}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
            >
              <ChevronLeft size={14} />
            </button>
            
            <div className="text-xs text-gray-400">
              {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              <span className={`ml-2 font-bold ${monthPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {monthPL >= 0 ? '+' : ''}${Math.abs(monthPL).toFixed(0)}
              </span>
            </div>
            
            <button
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() + 1);
                setCurrentMonth(newMonth);
              }}
              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          
          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 text-xs">
            {/* Day headers */}
            {['S','M','T','W','T','F','S'].map(d => (
              <div key={d} className="text-center text-gray-600 py-1">{d}</div>
            ))}
            
            {/* Days */}
            {days.map((date, i) => {
              const pl = getDayPL(date);
              const isToday = date.toDateString() === todayStr;
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const hasTrades = pl !== 0;
              
              return (
                <div
                  key={i}
                  className={`
                    aspect-square flex items-center justify-center rounded text-xs relative
                    ${!isCurrentMonth ? 'opacity-20' : ''}
                    ${isToday ? 'ring-1 ring-cyan-500' : ''}
                    ${hasTrades && !isToday ? 'bg-gray-800/50' : ''}
                  `}
                >
                  <span className={`${isToday ? 'text-cyan-400 font-bold' : 'text-gray-500'}`}>
                    {date.getDate()}
                  </span>
                  {hasTrades && (
                    <div className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                      pl >= 0 ? 'bg-emerald-400' : 'bg-red-400'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingCalendar;
