import React from 'react';
import { BarChart3, Calendar } from 'lucide-react';

interface Trade {
  id: string;
  created_at: string;
  profit: number;
  instrument: string;
  type: string;
  instructor: string;
  pips?: number;
  lot_size?: number;
  entry_price?: number;
  exit_price?: number;
}

interface TradingHistoryProps {
  trades?: Trade[];
  startingCapital?: number;
  dailyGoal?: number;
}

const TradingHistory: React.FC<TradingHistoryProps> = ({ 
  trades = [], 
  startingCapital = 100,
  dailyGoal = 10 
}) => {
  
  // Generate daily history (last 6 days for display)
  const generateDailyHistory = () => {
    const history = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayTrades = trades.filter(trade => 
        new Date(trade.created_at).toDateString() === dateStr
      );
      
      const dayProfit = dayTrades.reduce((sum, trade) => sum + trade.profit, 0);
      const totalPipsGained = dayTrades.reduce((sum, trade) => sum + (trade.pips || 0), 0);
      
      // Calculate capital at start of day
      const tradesBeforeDay = trades.filter(trade => 
        new Date(trade.created_at) < date
      );
      const profitBeforeDay = tradesBeforeDay.reduce((sum, trade) => sum + trade.profit, 0);
      const capitalAtStart = startingCapital + profitBeforeDay;
      
      const lotSize = dayTrades.length > 0 ? 
        (dayTrades.reduce((sum, trade) => sum + (trade.lot_size || 0.01), 0) / dayTrades.length) : 0;
      
      history.push({
        day: i + 1,
        date: date,
        capital: capitalAtStart,
        lotSize: lotSize,
        pipsGained: totalPipsGained,
        dailyProfit: dayProfit,
        endingCapital: capitalAtStart + dayProfit,
        achieved: dayProfit >= dailyGoal,
        tradesCount: dayTrades.length
      });
    }
    
    return history;
  };

  const dailyHistory = generateDailyHistory();

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <BarChart3 size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Trading Plan</h3>
              <p className="text-sm text-gray-400">
                Daily performance tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">LIVE</span>
          </div>
        </div>
      </div>

      {/* Trading History Section */}
      <div>
        <div className="w-full px-5 py-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <span className="font-medium text-white">Trading History</span>
            <span className="text-xs text-gray-500 ml-2">Last 6 days</span>
          </div>
        </div>
        
        <div className="p-5 animate-in slide-in-from-top-2">
          <div className="bg-gray-900/50 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-950/50 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-300 text-sm font-medium">Day</th>
                  <th className="text-center p-4 text-yellow-400 text-sm font-medium">Capital</th>
                  <th className="text-center p-4 text-yellow-400 text-sm font-medium">Lot Size</th>
                  <th className="text-center p-4 text-yellow-400 text-sm font-medium">Pips Gained</th>
                  <th className="text-center p-4 text-emerald-400 text-sm font-medium">Daily Profit</th>
                  <th className="text-center p-4 text-cyan-400 text-sm font-medium">Ending Capital</th>
                  <th className="text-center p-4 text-purple-400 text-sm font-medium">Achieved</th>
                </tr>
              </thead>
              <tbody>
                {[...dailyHistory].reverse().map((day, index) => (
                  <tr key={index} className={`border-b border-gray-700/30 hover:bg-gray-800/50 transition-colors ${
                    day.date.toDateString() === new Date().toDateString() ? 'bg-cyan-500/10 border-cyan-500/30' : ''
                  }`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`${
                          day.date.toDateString() === new Date().toDateString() 
                            ? 'w-8 h-8' : 'w-6 h-6'
                        } rounded-lg flex items-center justify-center text-xs font-bold ${
                          day.date.toDateString() === new Date().toDateString() 
                            ? 'bg-cyan-500/30 text-cyan-300 ring-2 ring-cyan-400/50' 
                            : day.achieved 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-gray-700 text-gray-300'
                        }`}>
                          {day.date.getDate()}
                        </div>
                        <div>
                          <div className={`font-medium ${
                            day.date.toDateString() === new Date().toDateString() 
                              ? 'text-cyan-300 text-base' : 'text-white text-sm'
                          }`}>
                            {day.date.toDateString() === new Date().toDateString() ? 'TODAY' : `Day ${day.date.getDate()}`}
                          </div>
                          <div className="text-xs text-gray-400">
                            {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-800 text-yellow-400 px-2 py-1 rounded text-sm font-mono border border-gray-600">
                        {day.capital.toFixed(0)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-800 text-yellow-400 px-2 py-1 rounded text-sm font-mono border border-gray-600">
                        {day.lotSize.toFixed(day.lotSize < 0.1 ? 4 : 2)}
                      </span>
                    </td>
                    <td className="p-4 text-center text-yellow-400 font-mono text-sm">
                      {day.pipsGained.toFixed(1)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-mono text-sm ${day.dailyProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {day.dailyProfit >= 0 ? '+' : ''}${day.dailyProfit.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-800 text-cyan-400 px-2 py-1 rounded text-sm font-mono border border-gray-600">
                        {day.endingCapital.toFixed(0)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        day.achieved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {day.achieved ? 'YES' : 'NO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {dailyHistory.length === 0 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <Calendar size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400">No trading history yet</p>
              <p className="text-sm text-gray-500 mt-2">Start trading to see your daily performance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingHistory;
