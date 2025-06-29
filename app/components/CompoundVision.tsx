'use client';

import React, { useMemo } from 'react';
import { TrendingUp, Target, Star, Zap, DollarSign, Shield } from 'lucide-react';

interface Trade {
  profit: number;
  pips: number;
  lot_size: number;
  created_at: string;
  instructor: string;
  instrument: string;
}

interface CompoundVisionProps {
  trades: Trade[];
  capital: number; // Starting capital
  compoundingPercent: number; // Percentage of profits to save
  riskPercent: number; // Daily risk limit percentage
}

const CompoundVision: React.FC<CompoundVisionProps> = ({
  trades = [],
  capital = 10000,
  compoundingPercent = 50,
  riskPercent = 5
}) => {
  // Calculate current state using app's exact logic
  const currentState = useMemo(() => {
    // Available capital calculation (matches app exactly)
    let available = capital;
    trades.forEach(trade => {
      available += trade.profit;
      if (trade.profit > 0) {
        available -= trade.profit * (compoundingPercent / 100);
      }
    });

    // Saved amount calculation (matches app exactly)
    let saved = 0;
    trades.forEach(trade => {
      if (trade.profit > 0) {
        saved += trade.profit * (compoundingPercent / 100);
      }
    });

    // Performance metrics
    const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const wins = trades.filter(t => t.profit > 0).length;
    const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 75;
    
    // Calculate average daily profit from actual trades
    const uniqueDays = new Set(
      trades.map(trade => new Date(trade.created_at).toDateString())
    ).size;
    const avgDailyProfit = uniqueDays > 0 ? totalProfit / uniqueDays : 0;

    // Calculate ACTUAL average daily pips from real trades (not reverse-calculated)
    const totalPips = trades.reduce((sum, trade) => sum + (trade.pips || 0), 0);
    const avgDailyPips = uniqueDays > 0 ? totalPips / uniqueDays : 0;

    // Daily risk limit
    const dailyLimit = capital * (riskPercent / 100);

    return {
      available: Math.round(available * 100) / 100,
      saved: Math.round(saved * 100) / 100,
      totalValue: Math.round((available + saved) * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      winRate: Math.round(winRate),
      avgDailyProfit: Math.round(avgDailyProfit * 100) / 100,
      avgDailyPips: Math.round(avgDailyPips * 10) / 10, // Add real pips tracking
      dailyLimit,
      tradingDays: uniqueDays,
      totalTrades: trades.length
    };
  }, [trades, capital, compoundingPercent, riskPercent]);

  // Project future compound growth using REALISTIC logic
  const projections = useMemo(() => {
    const { avgDailyProfit, winRate, tradingDays, avgDailyPips } = currentState;
    
    // Ensure we have valid starting values
    if (currentState.available <= 0) {
      return [
        { label: '1 Month', days: 22, icon: '🎯', available: currentState.available, saved: currentState.saved, totalValue: currentState.totalValue, growth: 0, multiplier: 1, totalProfit: 0 },
        { label: '6 Months', days: 132, icon: '🚀', available: currentState.available, saved: currentState.saved, totalValue: currentState.totalValue, growth: 0, multiplier: 1, totalProfit: 0 },
        { label: '1 Year', days: 250, icon: '💎', available: currentState.available, saved: currentState.saved, totalValue: currentState.totalValue, growth: 0, multiplier: 1, totalProfit: 0 },
        { label: '5 Years', days: 1250, icon: '👑', available: currentState.available, saved: currentState.saved, totalValue: currentState.totalValue, growth: 0, multiplier: 1, totalProfit: 0 }
      ];
    }
    
    // Use REALISTIC pips values with proper caps
    let dailyPipsTarget;
    if (tradingDays >= 5 && avgDailyPips > 0) {
      // Use actual performance but cap at realistic levels
      dailyPipsTarget = Math.min(Math.max(avgDailyPips, 10), 150); // Min 10, max 150 pips/day
    } else {
      // Conservative fallback for new traders
      dailyPipsTarget = 30; // 30 pips/day is reasonable
    }
    
    const winRateDecimal = Math.max(winRate / 100, 0.65); // Minimum 65% for projections
    
    // Calculate pip value based on instrument type (simplified)
    const pipValue = 10; // $10 per pip per lot for major forex pairs (standard assumption)

    const timeframes = [
      { label: '1 Month', days: 22, icon: '🎯' },
      { label: '6 Months', days: 132, icon: '🚀' },
      { label: '1 Year', days: 250, icon: '💎' },
      { label: '5 Years', days: 1250, icon: '👑' }
    ];

    return timeframes.map(tf => {
      let available = currentState.available;
      let saved = currentState.saved;
      let totalProfitGenerated = 0;
      
      for (let day = 1; day <= tf.days; day++) {
        // Calculate lot size with REALISTIC caps
        const maxLotSize = Math.min(available / 1000, 50); // Max 50 lots, or 1 lot per $1000
        const lotSize = Math.max(0.01, maxLotSize); // Min 0.01 lot
        
        // Calculate daily profit with REALISTIC limits
        let dailyProfit;
        if (Math.random() < winRateDecimal) {
          // Winning day: target pips × pip value × lot size
          const actualPips = dailyPipsTarget * (0.7 + Math.random() * 0.6); // 70-130% of target
          dailyProfit = actualPips * pipValue * lotSize;
        } else {
          // Losing day: smaller loss
          const lossPips = dailyPipsTarget * 0.4; // 40% of target as loss
          dailyProfit = -lossPips * pipValue * lotSize;
        }
        
        // Cap daily profit to prevent unrealistic gains
        const maxDailyGain = available * 0.1; // Max 10% gain per day
        const maxDailyLoss = available * 0.05; // Max 5% loss per day
        dailyProfit = Math.max(-maxDailyLoss, Math.min(maxDailyGain, dailyProfit));
        
        // Add profit to available capital
        available += dailyProfit;
        totalProfitGenerated += dailyProfit;
        
        // Apply compounding: move portion to savings
        if (dailyProfit > 0) {
          const toSave = dailyProfit * (compoundingPercent / 100);
          available -= toSave;
          saved += toSave;
        }
        
        // Ensure available doesn't go below minimum
        available = Math.max(available, currentState.available * 0.1);
        
        // Add some market reality - occasional larger drawdowns
        if (day % 30 === 0 && Math.random() < 0.3) {
          const drawdown = available * 0.02; // 2% monthly drawdown possibility
          available -= drawdown;
          totalProfitGenerated -= drawdown;
        }
      }

      const totalValue = available + saved;
      const initialValue = currentState.available + currentState.saved;
      const growth = totalValue - initialValue;
      const multiplier = initialValue > 0 ? totalValue / initialValue : 1;

      return {
        ...tf,
        available: Math.round(available),
        saved: Math.round(saved),
        totalValue: Math.round(totalValue),
        growth: Math.round(growth),
        multiplier: Math.round(multiplier * 100) / 100,
        totalProfit: Math.round(totalProfitGenerated),
        avgMonthlyGrowth: Math.round((growth / (tf.days / 22)) * 100) / 100
      };
    });
  }, [currentState, compoundingPercent]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getMotivationalMessage = () => {
    if (currentState.winRate >= 80) return "🔥 Elite performance! Your discipline is paying off!";
    if (currentState.winRate >= 70) return "💪 Strong consistency! Keep the momentum going!";
    if (currentState.winRate >= 60) return "⚡ Good foundation! Small improvements = big results!";
    return "🎯 Every journey starts with one step. Build your winning streak!";
  };

  // Generate visual growth chart data points for CSS animation
  const chartPoints = useMemo(() => {
    const points = [];
    let available = currentState.available;
    let saved = currentState.saved;
    
    // Use realistic projection logic for chart too
    const dailyPipsTarget = currentState.tradingDays >= 5 && currentState.avgDailyPips > 0 
      ? Math.min(Math.max(currentState.avgDailyPips, 10), 150)
      : 30;
    
    const pipValue = 10;
    const successRate = Math.max(currentState.winRate / 100, 0.65);

    for (let month = 0; month <= 12; month++) {
      if (month > 0) {
        const daysInMonth = 22; // Trading days
        
        for (let day = 0; day < daysInMonth; day++) {
          const maxLotSize = Math.min(available / 1000, 50);
          const lotSize = Math.max(0.01, maxLotSize);
          
          let dailyProfit;
          if (Math.random() < successRate) {
            const actualPips = dailyPipsTarget * (0.7 + Math.random() * 0.6);
            dailyProfit = actualPips * pipValue * lotSize;
          } else {
            const lossPips = dailyPipsTarget * 0.4;
            dailyProfit = -lossPips * pipValue * lotSize;
          }
          
          // Apply caps
          const maxDailyGain = available * 0.1;
          const maxDailyLoss = available * 0.05;
          dailyProfit = Math.max(-maxDailyLoss, Math.min(maxDailyGain, dailyProfit));
          
          available += dailyProfit;
          
          if (dailyProfit > 0) {
            const toSave = dailyProfit * (compoundingPercent / 100);
            available -= toSave;
            saved += toSave;
          }
          
          available = Math.max(available, currentState.available * 0.1);
        }
      }
      
      const totalValue = available + saved;
      const maxValue = Math.max(projections[2]?.totalValue || totalValue * 2, totalValue * 1.5);
      const heightPercent = Math.min((totalValue / maxValue) * 100, 100);
      
      points.push({
        month,
        totalValue: Math.round(totalValue),
        heightPercent,
        available: Math.round(available),
        saved: Math.round(saved)
      });
    }
    return points;
  }, [currentState, compoundingPercent, projections]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 mb-3">
          Your Wealth Vision
        </h2>
        <p className="text-gray-300 text-lg mb-2">
          {getMotivationalMessage()}
        </p>
        <div className="flex justify-center items-center space-x-4 text-sm">
          <span className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/40">
            {currentState.totalTrades} trades • {currentState.tradingDays} active days
          </span>
          <span className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/40">
            {currentState.winRate}% win rate
          </span>
        </div>
      </div>

      {/* Current Portfolio Status */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <DollarSign className="mx-auto mb-2 text-cyan-400" size={32} />
            <p className="text-2xl font-bold text-white">{formatCurrency(currentState.available)}</p>
            <p className="text-sm text-gray-400">Available Trading</p>
          </div>
          <div className="text-center">
            <Shield className="mx-auto mb-2 text-purple-400" size={32} />
            <p className="text-2xl font-bold text-white">{formatCurrency(currentState.saved)}</p>
            <p className="text-sm text-gray-400">Compound Savings</p>
          </div>
          <div className="text-center">
            <Target className="mx-auto mb-2 text-green-400" size={32} />
            <p className="text-2xl font-bold text-white">{formatCurrency(currentState.totalValue)}</p>
            <p className="text-sm text-gray-400">Total Portfolio</p>
          </div>
          <div className="text-center">
            <Zap className="mx-auto mb-2 text-orange-400" size={32} />
            <p className="text-2xl font-bold text-white">{compoundingPercent}%</p>
            <p className="text-sm text-gray-400">Reinvestment Rate</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        
        {/* Vision Milestones */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
            <Star className="mr-2" size={24} />
            If You Stay Disciplined...
          </h3>
          
          <div className="space-y-4">
            {projections.map((proj, index) => (
              <div 
                key={proj.label}
                className={`relative overflow-hidden rounded-2xl p-6 border transition-all hover:scale-[1.02] ${
                  index === 0 ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50' :
                  index === 1 ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/50' :
                  index === 2 ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50' :
                  'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{proj.icon}</span>
                      <h4 className="text-lg font-bold text-white">{proj.label}</h4>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {formatCurrency(proj.totalValue)}
                    </p>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>Trading: {formatCurrency(proj.available)}</p>
                      <p>Saved: {formatCurrency(proj.saved)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {proj.multiplier}x
                    </p>
                    <p className="text-xs text-gray-400">growth</p>
                  </div>
                </div>
                
                {/* Subtle background pattern */}
                <div className="absolute -top-4 -right-4 opacity-10">
                  <TrendingUp size={80} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Visualization */}
        <div className="lg:col-span-3">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6">Your Compound Journey</h3>
          
          {/* Custom Chart Alternative */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-2xl p-6 mb-6">
            <div className="h-80 relative">
              {/* Chart Background */}
              <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                {chartPoints.map((point, index) => (
                  <div key={index} className="flex flex-col items-center relative group">
                    {/* Bar */}
                    <div 
                      className="w-6 bg-gradient-to-t from-green-500 to-cyan-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-green-400 hover:to-cyan-300"
                      style={{ 
                        height: `${point.heightPercent}%`,
                        minHeight: '4px',
                        animationDelay: `${index * 100}ms`
                      }}
                    ></div>
                    
                    {/* Month Label */}
                    <span className="text-xs text-gray-400 mt-2">{point.month}M</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-cyan-500/30">
                      <div className="text-center">
                        <p className="font-bold text-green-400">{formatCurrency(point.totalValue)}</p>
                        <p className="text-gray-300">Month {point.month}</p>
                        <p className="text-xs text-cyan-400">Trading: {formatCurrency(point.available)}</p>
                        <p className="text-xs text-purple-400">Saved: {formatCurrency(point.saved)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-4">
                <span>{formatCurrency(projections[2]?.totalValue || currentState.totalValue * 2)}</span>
                <span>{formatCurrency((projections[2]?.totalValue || currentState.totalValue * 2) * 0.5)}</span>
                <span>$0</span>
              </div>
              
              {/* X-axis */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-600"></div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              Hover over bars to see monthly projections
            </p>
          </div>

          {/* Performance Insights */}
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
              The Power of Your System (Realistic)
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Your Avg Daily Pips:</span>
                  <span className="text-cyan-400 font-semibold">
                    {currentState.avgDailyPips > 0 ? currentState.avgDailyPips.toFixed(1) : 'Building baseline...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Your Daily Profit:</span>
                  <span className="text-green-400 font-semibold">
                    ${currentState.avgDailyProfit ? currentState.avgDailyProfit.toFixed(2) : 'Building baseline...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Current Position Size:</span>
                  <span className="text-green-400 font-semibold">
                    {Math.min(((currentState.available / 1000)), 50).toFixed(2)} lots max
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Your Win Rate:</span>
                  <span className="text-purple-400 font-semibold">{currentState.winRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Compounding Rate:</span>
                  <span className="text-orange-400 font-semibold">{compoundingPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">5-Year Potential:</span>
                  <span className="text-yellow-400 font-semibold">
                    {formatCurrency(projections[3]?.totalValue || 0)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {currentState.tradingDays >= 5 ? (
                  <>
                    <p className="text-gray-300 text-sm">
                      <span className="text-cyan-400 font-semibold">Your proven system:</span> Averaging {currentState.avgDailyPips.toFixed(1)} pips daily 
                      with realistic position sizing = ${currentState.avgDailyProfit?.toFixed(2)} daily profit.
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="text-green-400 font-semibold">Realistic compounding:</span> More capital = bigger (but capped) lot sizes. 
                      Consistent pips with proper risk management = sustainable growth.
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="text-purple-400 font-semibold">Your {compoundingPercent}% rule:</span> Each day's profit grows your trading power 
                      while {compoundingPercent}% builds wealth safely outside of trading risk.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 text-sm">
                      <span className="text-cyan-400 font-semibold">Building your system:</span> Projections use conservative 30 pips/day average.
                      Your actual performance will calibrate these estimates.
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="text-green-400 font-semibold">The formula:</span> Consistent daily pips × proper position sizing × 
                      disciplined compounding = sustainable wealth growth.
                    </p>
                    <p className="text-gray-300 text-sm">
                      <span className="text-purple-400 font-semibold">Stay realistic:</span> These projections include realistic limits, 
                      drawdowns, and risk management - not fantasy hockey-stick growth.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {currentState.totalTrades < 10 && (
              <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm text-center">
                  💡 <strong>Realistic projections:</strong> This version uses actual pips data and realistic caps. 
                  Current estimates use conservative assumptions until you complete more trades.
                </p>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm text-center">
                ✅ <strong>Fixed:</strong> Projections now use actual pips from your trades, realistic lot size caps (max 50), 
                daily profit limits (max 10% gain/5% loss), and include market drawdowns for realistic forecasting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundVision;
