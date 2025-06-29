'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle, TrendingUp, TrendingDown, Calendar, User, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TradeHistoryProps {
  trades: any[];
  setTrades: (trades: any[]) => void;
  user: any;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, setTrades, user }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Helper function to get user ID consistently
  const getUserId = (user: any) => {
    return user?.id || user?.user?.id;
  };

  // Delete trade function
  const deleteTrade = async (tradeId: string) => {
    try {
      setDeletingId(tradeId);
      
      const userId = getUserId(user);
      if (!userId) {
        alert('User ID not found!');
        return;
      }

      // Delete from database
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', tradeId)
        .eq('user_id', userId); // Ensure user can only delete their own trades

      if (error) {
        console.error('Error deleting trade:', error);
        alert('Failed to delete trade: ' + error.message);
      } else {
        // Update local state - remove the deleted trade
        const updatedTrades = trades.filter(trade => trade.id !== tradeId);
        setTrades(updatedTrades);
        
        // Show success message
        alert('Trade deleted successfully! All totals have been updated.');
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
      alert('Failed to delete trade: ' + error);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!trades || trades.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-3xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <BarChart3 size={32} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Trades Yet</h3>
          <p className="text-gray-400">Start tracking your trading journey!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
          <BarChart3 size={20} className="text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Trade History</h2>
          <p className="text-sm text-gray-400">{trades.length} total trades</p>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {trades.map((trade) => (
          <div 
            key={trade.id} 
            className="bg-black/40 border border-gray-700/50 rounded-2xl p-4 hover:border-gray-600/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Profit/Loss Indicator */}
                <div className={`w-3 h-3 rounded-full ${
                  trade.profit >= 0 ? 'bg-green-400' : 'bg-red-400'
                }`} />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white">
                      {trade.instrument}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      trade.type === 'BUY' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {trade.lot_size} lots
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{trade.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(trade.created_at)}</span>
                    </div>
                    {trade.pips && (
                      <span className={`flex items-center gap-1 ${
                        trade.pips >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.pips >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {trade.pips > 0 ? '+' : ''}{trade.pips.toFixed(1)} pips
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Profit/Loss Amount */}
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                  </div>
                  {trade.entry_price && trade.exit_price && (
                    <div className="text-xs text-gray-400">
                      {trade.entry_price.toFixed(trade.instrument.includes('JPY') ? 3 : 5)} → {trade.exit_price.toFixed(trade.instrument.includes('JPY') ? 3 : 5)}
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => setShowDeleteConfirm(trade.id)}
                  disabled={deletingId === trade.id}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete trade"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm === trade.id && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-red-400" />
                  <span className="text-sm font-medium text-red-400">
                    Confirm Deletion
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-3">
                  Are you sure you want to delete this {trade.instrument} trade? 
                  This will permanently remove it and recalculate all your totals.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteTrade(trade.id)}
                    disabled={deletingId === trade.id}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded font-medium transition-all disabled:opacity-50"
                  >
                    {deletingId === trade.id ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistory;
