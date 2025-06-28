'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AddTradeFormProps {
  showAddTrade: boolean;
  setShowAddTrade: (show: boolean) => void;
  remainingAllowance: number;
  maxLotSize: number;
  trades: any[];
  setTrades: (trades: any[]) => void;
  compoundingPercent: number;
  user: any;
}

const AddTradeForm: React.FC<AddTradeFormProps> = ({ 
  showAddTrade, 
  setShowAddTrade, 
  remainingAllowance, 
  maxLotSize, 
  trades, 
  setTrades, 
  compoundingPercent,
  user
}) => {
  const [formData, setFormData] = useState({
    instructor: '',
    instrument: 'DJ30',
    type: 'BUY' as 'BUY' | 'SELL',
    lotSize: 0.1,
    profit: '',
    entryPrice: '',
    exitPrice: '',
    customInstructor: ''
  });
  
  // Helper function to get user ID consistently
  const getUserId = (user: any) => {
    return user?.id || user?.user?.id;
  };
  
  // Pip size mapping for different instruments (1 pip = this much price movement)
  const getPipSize = (instrument: string): number => {
    const pipSizes: Record<string, number> = {
      // Forex majors (4 decimal places, except JPY pairs)
      'EURUSD': 0.0001, 'GBPUSD': 0.0001, 'USDCHF': 0.0001,
      'AUDUSD': 0.0001, 'USDCAD': 0.0001, 'NZDUSD': 0.0001,
      // JPY pairs (2 decimal places)
      'USDJPY': 0.01, 'EURJPY': 0.01, 'GBPJPY': 0.01, 'CADJPY': 0.01, 'CHFJPY': 0.01,
      // Other forex pairs
      'EURGBP': 0.0001, 'AUDCAD': 0.0001, 'EURAUD': 0.0001, 'EURNZD': 0.0001,
      'GBPAUD': 0.0001, 'GBPNZD': 0.0001,
      // Indices (1 point = 10 pips, so 1 pip = 0.1 point)
      'DJ30': 0.1, 'SPX500': 0.1, 'NAS100': 0.1, 'DAX40': 0.1,
      'FTSE100': 0.1, 'NIK225': 0.1, 'ASX200': 0.1, 'HK50': 0.1,
      // Commodities
      'XAUUSD': 0.1,  // Gold: 1 pip = 0.1 price movement (3330 to 3331 = 10 pips)
      'XAGUSD': 0.01, // Silver: 1 pip = 0.01 price movement
      'USOIL': 0.01,  // Oil: 1 pip = 0.01 price movement
      'UKOIL': 0.01,
      'NATGAS': 0.001,
      'COPPER': 0.0001,
      // Crypto (varies by crypto)
      'BTCUSD': 1,
      'ETHUSD': 0.1,
    };
    
    return pipSizes[instrument] || 0.0001; // Default to forex standard
  };
  
  // Instructor options
  const instructors = [
    'ICT (Inner Circle Trader)',
    'Smart Money Concepts',
    'Wyckoff Method',
    'Elliott Wave',
    'Volume Profile',
    'Custom Strategy',
    'Other'
  ];
  
  // Instrument options
  const instruments = [
    { value: 'DJ30', label: 'Dow Jones 30' },
    { value: 'SPX500', label: 'S&P 500' },
    { value: 'NAS100', label: 'NASDAQ 100' },
    { value: 'DAX40', label: 'DAX 40' },
    { value: 'FTSE100', label: 'FTSE 100' },
    { value: 'EURUSD', label: 'EUR/USD' },
    { value: 'GBPUSD', label: 'GBP/USD' },
    { value: 'USDJPY', label: 'USD/JPY' },
    { value: 'XAUUSD', label: 'Gold' },
    { value: 'XAGUSD', label: 'Silver' },
    { value: 'USOIL', label: 'Crude Oil' },
    { value: 'BTCUSD', label: 'Bitcoin' },
    { value: 'ETHUSD', label: 'Ethereum' }
  ];
  
  // Calculate pips from entry/exit prices
  const calculatePips = (): number => {
    const entryPrice = parseFloat(formData.entryPrice);
    const exitPrice = parseFloat(formData.exitPrice);
    
    if (!entryPrice || !exitPrice) return 0;
    
    const pipSize = getPipSize(formData.instrument);
    const priceDiff = formData.type === 'BUY' ? exitPrice - entryPrice : entryPrice - exitPrice;
    return priceDiff / pipSize;
  };
  
  const calculatedPips = calculatePips();
  
  const handleSubmit = async () => {
    const instructorName = formData.instructor === 'Other' ? 
      formData.customInstructor : formData.instructor;
    
    if (!instructorName || !formData.profit) {
      alert('Please fill all required fields');
      return;
    }
    
    const profitAmount = parseFloat(formData.profit);
    
    if (profitAmount < 0 && Math.abs(profitAmount) > remainingAllowance) {
      if (!confirm(`This trade exceeds your daily risk limit! You can only lose $${remainingAllowance.toFixed(2)} more today. Continue anyway?`)) {
        return;
      }
    }
    
    const userId = getUserId(user);
    if (!userId) {
      alert('User ID not found!');
      return;
    }
    
    const newTrade = {
      user_id: userId,
      instructor: instructorName,
      instrument: formData.instrument,
      type: formData.type,
      lot_size: parseFloat(formData.lotSize.toString()),
      profit: profitAmount,
      pips: calculatedPips,
      entry_price: parseFloat(formData.entryPrice) || null,
      exit_price: parseFloat(formData.exitPrice) || null
    };
    
    try {
      const { data, error } = await supabase
        .from('trades')
        .insert([newTrade])
        .select();
        
      if (error) {
        alert('Failed to save trade: ' + error.message);
      } else {
        setTrades([...trades, data[0]]);
        setShowAddTrade(false);
        setFormData({
          instructor: '',
          instrument: 'DJ30',
          type: 'BUY',
          lotSize: 0.1,
          profit: '',
          entryPrice: '',
          exitPrice: '',
          customInstructor: ''
        });
      }
    } catch (error) {
      alert('Failed to save trade: ' + error);
    }
  };
  
  if (!showAddTrade) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-cyan-500/20 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            New Trade Entry
          </h2>
          <button 
            onClick={() => setShowAddTrade(false)} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Instructor Selection */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Instructor</label>
            {formData.instructor === 'Other' ? (
              <input
                type="text"
                placeholder="Enter custom instructor name"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.customInstructor}
                onChange={(e) => setFormData({...formData, customInstructor: e.target.value})}
              />
            ) : (
              <select 
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
              >
                <option value="">Select Instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor} value={instructor} className="bg-gray-800">
                    {instructor}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {/* Instrument Selection */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Instrument</label>
            <select 
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.instrument}
              onChange={(e) => setFormData({...formData, instrument: e.target.value})}
            >
              {instruments.map(instrument => (
                <option key={instrument.value} value={instrument.value} className="bg-gray-800">
                  {instrument.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Trade Type */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Trade Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'BUY'})}
                className={`py-3 rounded-xl font-medium transition-all ${
                  formData.type === 'BUY' 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-green-400 shadow-lg shadow-green-500/20' 
                    : 'bg-black/40 border border-gray-700 text-gray-400 hover:border-green-400/30'
                }`}
              >
                LONG
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'SELL'})}
                className={`py-3 rounded-xl font-medium transition-all ${
                  formData.type === 'SELL' 
                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/50 text-red-400 shadow-lg shadow-red-500/20' 
                    : 'bg-black/40 border border-gray-700 text-gray-400 hover:border-red-400/30'
                }`}
              >
                SHORT
              </button>
            </div>
          </div>
          
          {/* Lot Size */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Lot Size <span className="text-xs text-gray-400">(Max: {maxLotSize.toFixed(2)})</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.lotSize}
              onChange={(e) => setFormData({...formData, lotSize: parseFloat(e.target.value) || 0})}
            />
          </div>
          
          {/* Entry and Exit Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Entry Price <span className="text-xs text-gray-400">(for pips calc)</span>
              </label>
              <input
                type="number"
                step="0.00001"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.entryPrice}
                onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
                placeholder="1.0850"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Exit Price <span className="text-xs text-gray-400">(for pips calc)</span>
              </label>
              <input
                type="number"
                step="0.00001"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.exitPrice}
                onChange={(e) => setFormData({...formData, exitPrice: e.target.value})}
                placeholder="1.0870"
              />
            </div>
          </div>
          
          {/* Profit/Loss */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Profit/Loss ($) *
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.profit}
              onChange={(e) => setFormData({...formData, profit: e.target.value})}
              placeholder="Enter profit (+) or loss (-)"
            />
            
            {/* Pips Calculation Display */}
            {formData.entryPrice && formData.exitPrice && (
              <div className="mt-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyan-400">Calculated Pips:</span>
                  <span className={`font-medium ${calculatedPips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {calculatedPips >= 0 ? '+' : ''}{calculatedPips.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
            
            {/* Risk Warning */}
            {parseFloat(formData.profit) < 0 && Math.abs(parseFloat(formData.profit)) > remainingAllowance && (
              <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  Exceeds daily risk limit!
                </p>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25"
          >
            Execute Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTradeForm;
