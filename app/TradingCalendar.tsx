'use client';

import React, { useState, useEffect } from 'react';

interface Trade {
  id: string;
  created_at: string;
  pips: number;
  profit: number;
  [key: string]: any;
}

interface TradingCalendarProps {
  trades: Trade[];
}

const TradingCalendar: React.FC<TradingCalendarProps> = ({ trades }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<Record<string, any>>({});
  
  // Process trades data to get daily statistics
  useEffect(() => {
    const dailyStats: Record<string, any> = {};
    
    trades.forEach(trade => {
      const tradeDate = new Date(trade.created_at).toDateString();
      if (!dailyStats[tradeDate]) {
        dailyStats[tradeDate] = {
          trades: 0,
          pips: 0,
          profit: 0
        };
      }
      dailyStats[tradeDate].trades++;
      dailyStats[tradeDate].pips += trade.pips || 0;
      dailyStats[tradeDate].profit += trade.profit || 0;
    });
    
    setCalendarData(dailyStats);
  }, [trades]);
  
  // Get calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const days = getDaysInMonth(currentDate);
  const today = new Date().toDateString();
  
  // Calculate monthly totals
  const monthlyTotals = Object.entries(calendarData).reduce((acc, [date, stats]) => {
    const d = new Date(date);
    if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
      acc.trades += stats.trades;
      acc.pips += stats.pips;
      acc.profit += stats.profit;
    }
    return acc;
  }, { trades: 0, pips: 0, profit: 0 });
  
  return (
    <div className="bg-gray-900/60 rounded-2xl p-4 md:p-6 border border-gray-800">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          📅 Trading Calendar
        </h3>
        <p className="text-sm text-gray-400">Track your daily progress towards 80 pips target</p>
      </div>
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h4 className="text-lg font-semibold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Monthly Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-800/50 rounded-xl">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total Trades</p>
          <p className="text-xl font-bold text-white">{monthlyTotals.trades}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total Pips</p>
          <p className={`text-xl font-bold ${monthlyTotals.pips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {monthlyTotals.pips.toFixed(1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total P&L</p>
          <p className={`text-xl font-bold ${monthlyTotals.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${monthlyTotals.profit.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          
          const dateStr = day.toDateString();
          const dayData = calendarData[dateStr] || { trades: 0, pips: 0, profit: 0 };
          const isToday = dateStr === today;
          const pipProgress = (dayData.pips / 80) * 100;
          const hasData = dayData.trades > 0;
          
          return (
            <div
              key={dateStr}
              className={`
                aspect-square rounded-lg p-1 md:p-2 border transition-all cursor-pointer
                ${isToday ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-800 hover:border-gray-700'}
                ${hasData ? 'bg-gray-800/50' : 'bg-gray-900/30'}
              `}
            >
              <div className="h-full flex flex-col justify-between">
                <div className="text-xs font-medium text-gray-400">
                  {day.getDate()}
                </div>
                
                {hasData && (
                  <div className="space-y-1">
                    {/* Pip progress bar */}
                    <div className="relative h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full transition-all ${
                          dayData.pips >= 80 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                            : dayData.pips >= 40 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                            : 'bg-gradient-to-r from-red-400 to-pink-400'
                        }`}
                        style={{ width: `${Math.min(pipProgress, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">
                        {dayData.trades}T
                      </span>
                      <span className={`text-[10px] font-medium ${
                        dayData.pips >= 80 ? 'text-green-400' : 
                        dayData.pips >= 0 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {dayData.pips.toFixed(0)}p
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded"></div>
            <span className="text-gray-400">≥80 pips (Target met)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded"></div>
            <span className="text-gray-400">40-79 pips</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded"></div>
            <span className="text-gray-400">&lt;40 pips</span>
          </div>
          <div className="ml-auto text-gray-400">
            T = Trades | p = Pips
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingCalendar;
