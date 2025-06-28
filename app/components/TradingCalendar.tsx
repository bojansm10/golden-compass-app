// components/TradingCalendar.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  // Get the first day to display (might be from previous month)
  const firstDayToDisplay = new Date(firstDayOfMonth);
  firstDayToDisplay.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
  
  // Generate calendar days
  const calendarDays: Date[] = [];
  const currentDate = new Date(firstDayToDisplay);
  
  while (currentDate <= lastDayOfMonth || currentDate.getDay() !== 0) {
    calendarDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate daily P&L for each day
  const getDayStats = (date: Date) => {
    const dayTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.created_at);
      return tradeDate.toDateString() === date.toDateString();
    });
    const totalPL = dayTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const totalPips = dayTrades.reduce((sum, trade) => sum + (trade.pips || 0), 0);
    return { totalPL, totalPips, trades: dayTrades, count: dayTrades.length };
  };
  
  // Calculate monthly stats
  const getMonthlyStats = () => {
    const monthTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.created_at);
      return tradeDate.getMonth() === currentMonth.getMonth() && 
             tradeDate.getFullYear() === currentMonth.getFullYear();
    });
    
    const totalPL = monthTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const totalPips = monthTrades.reduce((sum, trade) => sum + (trade.pips || 0), 0);
    const wins = monthTrades.filter(trade => trade.profit > 0).length;
    const winRate = monthTrades.length > 0 ? (wins / monthTrades.length) * 100 : 0;
    
    return { totalPL, totalPips, wins, total: monthTrades.length, winRate };
  };
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  };
  
  const monthStats = getMonthlyStats();
  const today = new Date();
  const todayStats = getDayStats(today);
  
  return (
    <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Trading Calendar</h2>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-all text-gray-400 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-gray-300 min-w-[120px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-all text-gray-400 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Inline Monthly Stats - More Compact */}
      <div className="flex items-center justify-between mb-4 p-3 bg-black/40 rounded-xl">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Month P&L:</span>
            <span className={`font-bold ${monthStats.totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {monthStats.totalPL >= 0 ? '+' : ''}${Math.abs(monthStats.totalPL).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Trades:</span>
            <span className="font-bold text-white">{monthStats.total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Win Rate:</span>
            <span className="font-bold text-cyan-400">{monthStats.winRate.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Pips:</span>
            <span className="font-bold text-purple-400">{monthStats.totalPips.toFixed(0)}</span>
          </div>
        </div>
        
        {/* Today's Quick Stats */}
        <div className="flex items-center gap-3 text-sm">
          <div className="h-6 w-px bg-gray-700"></div>
          <span className="text-gray-400">Today:</span>
          <span className={`font-bold ${todayStats.totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {todayStats.totalPL >= 0 ? '+' : ''}${Math.abs(todayStats.totalPL).toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Compact Calendar Grid */}
      <div className="bg-black/20 rounded-xl p-3">
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers - smaller */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div 
              key={day} 
              className="text-center text-xs py-2 text-gray-500 font-medium"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days - more compact */}
          {calendarDays.map((date, index) => {
            const dayStats = getDayStats(date);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const hasTrades = dayStats.count > 0;
            
            return (
              <div
                key={index}
                onClick={() => {
                  if (hasTrades) {
                    setSelectedDate(isSelected ? null : date);
                  }
                }}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-lg
                  transition-all cursor-pointer text-sm
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isToday ? 'ring-2 ring-cyan-500/50 bg-cyan-500/10' : ''}
                  ${isSelected ? 'bg-gray-800 ring-2 ring-gray-700' : ''}
                  ${hasTrades && !isSelected && !isToday ? 'hover:bg-gray-800/50' : ''}
                  ${!hasTrades && isCurrentMonth && !isToday ? 'text-gray-600' : ''}
                `}
              >
                {/* Date number */}
                <div className={`text-xs ${isToday ? 'font-bold text-cyan-400' : 'text-gray-400'}`}>
                  {date.getDate()}
                </div>
                
                {/* Compact trade indicator */}
                {hasTrades && (
                  <>
                    <div className={`text-xs font-bold mt-0.5 ${
                      dayStats.totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {dayStats.totalPL >= 0 ? '+' : ''}{Math.abs(dayStats.totalPL) >= 100 
                        ? `${(dayStats.totalPL / 1000).toFixed(1)}k` 
                        : dayStats.totalPL.toFixed(0)
                      }
                    </div>
                    {/* Small dot indicator */}
                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      dayStats.totalPL >= 0 ? 'bg-emerald-400' : 'bg-red-400'
                    }`}></div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Selected Day Details - Compact Dropdown */}
      {selectedDate && getDayStats(selectedDate).count > 0 && (
        <div className="mt-3 p-3 bg-black/40 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(null);
              }}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          {/* Compact trade list */}
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {getDayStats(selectedDate).trades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-4 rounded-full ${
                    trade.profit >= 0 ? 'bg-emerald-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-xs text-gray-300">{trade.instrument}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    trade.type === 'BUY' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.type}
                  </span>
                </div>
                <span className={`text-xs font-medium ${
                  trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          {/* Day total */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-400">Day Total:</span>
            <span className={`text-sm font-bold ${
              getDayStats(selectedDate).totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {getDayStats(selectedDate).totalPL >= 0 ? '+' : ''}${Math.abs(getDayStats(selectedDate).totalPL).toFixed(2)}
            </span>
          </div>
        </div>
      )}
      
      {/* Minimal Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          <span>Profit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span>Loss</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 ring-2 ring-cyan-500/50 rounded-full"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default TradingCalendar;
