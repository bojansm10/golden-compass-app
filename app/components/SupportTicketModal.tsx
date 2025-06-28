import React from 'react';
import { X } from 'lucide-react';

interface SupportTicketModalProps {
  showSupportTicket: boolean;
  setShowSupportTicket: (show: boolean) => void;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ 
  showSupportTicket, 
  setShowSupportTicket 
}) => {
  if (!showSupportTicket) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-blue-500/20 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl shadow-blue-500/10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
            Support Ticket
          </h2>
          <button 
            onClick={() => setShowSupportTicket(false)} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2">Name *</label>
              <input
                type="text"
                className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2">Email *</label>
              <input
                type="email"
                className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">Issue Type</label>
            <select className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all">
              <option value="">Select issue type...</option>
              <option value="bug">🐛 Bug Report</option>
              <option value="feature">✨ Feature Request</option>
              <option value="support">🎧 General Support</option>
              <option value="account">👤 Account Issue</option>
              <option value="data">📊 Data/Calculation Issue</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 px-3 rounded-lg border border-green-500/30 text-green-400 text-sm hover:bg-green-500/10 transition-all">
                Low
              </button>
              <button className="py-2 px-3 rounded-lg border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-500/10 transition-all">
                Medium
              </button>
              <button className="py-2 px-3 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all">
                High
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">Subject *</label>
            <input
              type="text"
              className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all"
              placeholder="Brief description of the issue"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">Description *</label>
            <textarea
              rows={4}
              className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all resize-none"
              placeholder="Please provide detailed information about your issue, including steps to reproduce if it's a bug..."
            ></textarea>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-blue-400 mb-2">📋 System Information (automatically included):</p>
            <p className="text-xs text-gray-400">Browser: Chrome • OS: Unknown • App Version: 1.0</p>
          </div>
          
          <button
            onClick={() => {
              alert('Support ticket submitted! We\'ll get back to you within 24 hours.');
              setShowSupportTicket(false);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
          >
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketModal;
