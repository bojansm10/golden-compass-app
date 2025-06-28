// components/TradingCalendar.tsx
'use client';

import React, { useState } from 'react';
import { Activity, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Calendar, Target, Zap, DollarSign } from 'lucide-react';

interface Trade {
  id: string;
  created_at: string;
  profit: number;
  instrument: string;
  type: string;
  instructor: string;
}

interface TradingCalendarProps {
  trades: Trade[];
}

const TradingCalendar: React.FC<TradingCalendarProps> = ({ trades }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
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
  const getDayPL = (date: Date) => {
    const dayTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.created_at);
      return tradeDate.toDateString() === date.toDateString();
    });
    return dayTrades.reduce((sum, trade) => sum + trade.profit, 0);
  };
  
  // Get trades for a specific day
  const getDayTrades = (date: Date) => {
    return trades.filter(trade => {
      const tradeDate = new Date(trade.created_at);
      return tradeDate.toDateString() === date.toDateString();
    });
  };
  
  // Calculate monthly stats
  const getMonthlyStats = () => {
    const monthTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.created_at);
      return tradeDate.getMonth() === currentMonth.getMonth() && 
             tradeDate.getFullYear() === currentMonth.getFullYear();
    });
    
    const totalPL = monthTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const wins = monthTrades.filter(trade => trade.profit > 0).length;
    const losses = monthTrades.filter(trade => trade.profit < 0).length;
    const bestDay = Math.max(...monthTrades.map(t => t.profit), 0);
    const worstDay = Math.min(...monthTrades.map(t => t.profit), 0);
    
    return { totalPL, wins, losses, total: monthTrades.length, bestDay, worstDay };
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
  
  // Motivational quotes for empty days
  const motivationalQuotes = [
    "Ready to trade",
    "Opportunity awaits",
    "Stay disciplined",
    "Trust the process",
    "Focus & execute",
    "Risk managed",
    "Stay patient",
    "Market ready"
  ];
  
  const getRandomQuote = (date: Date) => {
    const seed = date.getDate() + date.getMonth();
    return motivationalQuotes[seed % motivationalQuotes.length];
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90 rounded-3xl border border-gray-800 p-4 md:p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl">
            <Calendar size={24} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Trading Calendar</h2>
            <p className="text-sm text-gray-400">Track your daily progress towards 80 pips target</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all hover:scale-110"
          >
            <ChevronLeft size={16} className="text-gray-400" />
          </button>
          <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 min-w-[140px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all hover:scale-110"
          >
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Monthly Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">PROFIT</span>
          </div>
          <p className={`text-lg font-bold ${monthStats.totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {monthStats.totalPL >= 0 ? '+' : ''}${Math.abs(monthStats.totalPL).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <Activity size={16} className="text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">TRADES</span>
          </div>
          <p className="text-lg font-bold text-white">{monthStats.total}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <Target size={16} className="text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">WIN RATE</span>
          </div>
          <p className="text-lg font-bold text-white">
            {monthStats.total > 0 ? ((monthStats.wins / monthStats.total) * 100).toFixed(0) : 0}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">BEST DAY</span>
          </div>
          <p className="text-lg font-bold text-yellow-400">
            ${monthStats.bestDay.toFixed(0)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-4 border border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-xs text-red-400 font-medium">WORST</span>
          </div>
          <p className="text-lg font-bold text-red-400">
            ${Math.abs(monthStats.worstDay).toFixed(0)}
          </p>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 rounded-2xl"></div>
        
        <div className="relative grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div 
              key={day} 
              className={`text-center text-xs py-3 font-medium ${
                index === 0 || index === 6 
                  ? 'text-purple-400' 
                  : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            const dayPL = getDayPL(date);
            const dayTrades = getDayTrades(date);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isHovered = hoveredDate?.toDateString() === date.toDateString();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const hasTrades = dayTrades.length > 0;
            
            return (
              <div
                key={index}
                onClick={() => dayTrades.length > 0 && setSelectedDate(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`
                  relative group rounded-xl border transition-all duration-300 min-h-[80px] overflow-hidden
                  ${isCurrentMonth 
                    ? hasTrades 
                      ? 'bg-gradient-to-br from-gray-900/90 to-black/90' 
                      : 'bg-gradient-to-br from-gray-900/40 to-gray-800/40'
                    : 'bg-gray-900/20'
                  }
                  ${isToday 
                    ? 'border-cyan-400/50 shadow-lg shadow-cyan-500/20' 
                    : hasTrades
                      ? dayPL >= 0
                        ? 'border-emerald-500/30 hover:border-emerald-400/50'
                        : 'border-red-500/30 hover:border-red-400/50'
                      : 'border-gray-800/50 hover:border-gray-700'
                  }
                  ${isSelected ? 'ring-2 ring-cyan-400/50 border-cyan-400' : ''}
                  ${hasTrades ? 'cursor-pointer hover:scale-[1.02]' : ''}
                  ${isHovered && !hasTrades ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60' : ''}
                `}
              >
                {/* Date number */}
                <div className={`absolute top-2 left-2 text-sm font-medium ${
                  isCurrentMonth 
                    ? isToday 
                      ? 'text-cyan-400' 
                      : isWeekend 
                        ? 'text-purple-400' 
                        : 'text-gray-300'
                    : 'text-gray-600'
                }`}>
                  {date.getDate()}
                </div>
                
                {/* Today indicator */}
                {isToday && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                )}
                
                {hasTrades ? (
                  <>
                    {/* Trade indicator dot */}
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                      dayPL >= 0 ? 'bg-emerald-400' : 'bg-red-400'
                    } ${!isToday ? 'animate-pulse' : ''}`}></div>
                    
                    {/* P&L display */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className={`text-sm font-bold ${
                        dayPL >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {dayPL >= 0 ? '+' : ''}${Math.abs(dayPL).toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dayTrades.length} trade{dayTrades.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {/* Profit/Loss gradient overlay */}
                    <div className={`absolute inset-0 opacity-10 ${
                      dayPL >= 0 
                        ? 'bg-gradient-to-br from-emerald-400 to-transparent' 
                        : 'bg-gradient-to-br from-red-400 to-transparent'
                    }`}></div>
                  </>
                ) : isCurrentMonth ? (
                  <>
                    {/* Empty day content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center px-2">
                        <DollarSign size={20} className="mx-auto text-gray-600 mb-1" />
                        <p className="text-xs text-gray-500 italic">
                          {getRandomQuote(date)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Subtle pattern for empty days */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 via-transparent to-gray-700/20"></div>
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Selected Day Details */}
      {selectedDate && getDayTrades(selectedDate).length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar size={16} className="text-cyan-400" />
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1 hover:bg-gray-800 rounded-lg"
            >
              ✕ Close
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {getDayTrades(selectedDate).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl hover:bg-black/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${trade.profit >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{trade.instrument}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        trade.type === 'BUY' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{trade.instructor}</span>
                  </div>
                </div>
                <span className={`font-bold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-sm text-gray-400">Day Total:</span>
            <span className={`text-lg font-bold ${getDayPL(selectedDate) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {getDayPL(selectedDate) >= 0 ? '+' : ''}${Math.abs(getDayPL(selectedDate)).toFixed(2)}
            </span>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
          <span className="text-gray-400">Profit Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-gray-400">Loss Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-cyan-400 rounded-full"></div>
          <span className="text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
          <span className="text-gray-400">No Trades</span>
        </div>
      </div>
    </div>
  );
};

export default TradingCalendar;
