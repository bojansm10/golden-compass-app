import LoginPage from './components/LoginPage';
import TradingCalendar from './components/TradingCalendar';
import RegisterPage from './components/RegisterPage';
// ✅ ADDED: Import the extracted AddTradeForm component
import AddTradeForm from './components/AddTradeForm';

// ❌ REMOVED: The entire AddTradeForm component definition (~400 lines) - now imported above
// Add Trade Form Component
const AddTradeForm = ({ 
  showAddTrade, 
  setShowAddTrade, 
  remainingAllowance, 
  maxLotSize, 
  trades, 
  setTrades, 
  compoundingPercent,
  user
}: any) => {
  const [formData, setFormData] = useState({
    instructor: '',
    instrument: 'DJ30',
    type: 'BUY',
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
  const getPipSize = (instrument: string) => {
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
      'BTCUSD': 1,     // Bitcoin: 1 pip = $1 movement
      'ETHUSD': 0.1,   // Ethereum: 1 pip = $0.1 movement
      'LTCUSD': 0.01,  // Litecoin: 1 pip = $0.01 movement
      'ADAUSD': 0.0001,
      'DOTUSD': 0.001
    };
    
    return pipSizes[instrument] || 0.0001;
  };
  
  // Calculate pips from price movement
  const calculatePips = (entryPrice: string, exitPrice: string, instrument: string, type: string) => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    
    if (!entry || !exit || !instrument) return 0;
    
    const pipSize = getPipSize(instrument);
    let priceMovement = exit - entry;
    
    // For SELL trades, positive movement is when price goes down
    if (type === 'SELL') {
      priceMovement = entry - exit;
    }
    
    // Calculate pips (can be positive or negative)
    const pips = priceMovement / pipSize;
    
    return Math.round(pips * 10) / 10; // Round to 1 decimal place
  };
  
  const calculatedPips = calculatePips(formData.entryPrice, formData.exitPrice, formData.instrument, formData.type);
  
  const handleSubmit = async () => {
    const instructorName = formData.instructor === 'Other' ? formData.customInstructor : formData.instructor;
    
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
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Instructor</label>
            {formData.instructor === 'Other' ? (
              <input
                type="text"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.customInstructor}
                onChange={(e) => setFormData({...formData, customInstructor: e.target.value})}
                placeholder="Enter instructor name..."
                autoFocus
              />
            ) : (
              <select 
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value, customInstructor: ''})}
              >
                <option value="">Select instructor...</option>
                <option value="Kristijan S.">Kristijan S.</option>
                <option value="Abdallah">Abdallah</option>
                <option value="Ploutos">Ploutos</option>
                <option value="Edris">Edris</option>
                <option value="Bojan S.">Bojan S.</option>
                <option value="Self">Self</option>
                <option value="Other">Other (custom)</option>
              </select>
            )}
            {formData.instructor === 'Other' && (
              <button
                type="button"
                onClick={() => setFormData({...formData, instructor: '', customInstructor: ''})}
                className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 transition-colors"
              >
                ← Back to list
              </button>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Instrument</label>
            <select 
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.instrument}
              onChange={(e) => setFormData({...formData, instrument: e.target.value})}
            >
              <optgroup label="Forex Majors">
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="USDCHF">USD/CHF</option>
                <option value="AUDUSD">AUD/USD</option>
                <option value="USDCAD">USD/CAD</option>
                <option value="NZDUSD">NZD/USD</option>
              </optgroup>
              <optgroup label="Forex Minors">
                <option value="EURJPY">EUR/JPY</option>
                <option value="EURGBP">EUR/GBP</option>
                <option value="GBPJPY">GBP/JPY</option>
                <option value="AUDCAD">AUD/CAD</option>
                <option value="CADJPY">CAD/JPY</option>
                <option value="CHFJPY">CHF/JPY</option>
                <option value="EURAUD">EUR/AUD</option>
                <option value="EURNZD">EUR/NZD</option>
                <option value="GBPAUD">GBP/AUD</option>
                <option value="GBPNZD">GBP/NZD</option>
              </optgroup>
              <optgroup label="Indices">
                <option value="DJ30">Dow Jones 30</option>
                <option value="SPX500">S&P 500</option>
                <option value="NAS100">NASDAQ 100</option>
                <option value="DAX40">DAX 40</option>
                <option value="FTSE100">FTSE 100</option>
                <option value="NIK225">Nikkei 225</option>
                <option value="ASX200">ASX 200</option>
                <option value="HK50">Hang Seng 50</option>
              </optgroup>
              <optgroup label="Commodities">
                <option value="XAUUSD">Gold (XAU/USD)</option>
                <option value="XAGUSD">Silver (XAG/USD)</option>
                <option value="USOIL">Crude Oil (WTI)</option>
                <option value="UKOIL">Brent Oil</option>
                <option value="NATGAS">Natural Gas</option>
                <option value="COPPER">Copper</option>
              </optgroup>
              <optgroup label="Cryptocurrency">
                <option value="BTCUSD">Bitcoin (BTC/USD)</option>
                <option value="ETHUSD">Ethereum (ETH/USD)</option>
                <option value="LTCUSD">Litecoin (LTC/USD)</option>
                <option value="ADAUSD">Cardano (ADA/USD)</option>
                <option value="DOTUSD">Polkadot (DOT/USD)</option>
              </optgroup>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Direction</label>
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
          
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Lot Size <span className="text-xs text-gray-400">(Max: {maxLotSize})</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.lotSize}
              onChange={(e) => setFormData({...formData, lotSize: parseFloat(e.target.value) || 0})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Entry Price <span className="text-xs text-gray-400">(required for pips)</span></label>
              <input
                type="number"
                step="0.00001"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.entryPrice}
                onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
                placeholder="0.00000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Exit Price <span className="text-xs text-gray-400">(required for pips)</span></label>
              <input
                type="number"
                step="0.00001"
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                value={formData.exitPrice}
                onChange={(e) => setFormData({...formData, exitPrice: e.target.value})}
                placeholder="0.00000"
              />
            </div>
          </div>
          
          {/* Pip calculation helper */}
          {formData.instrument && (
            <div className="text-xs text-gray-500 bg-gray-800/30 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Activity size={12} className="text-cyan-400" />
                <span className="text-cyan-400 font-medium">Live Pip Calculator</span>
              </div>
              {formData.instrument === 'XAUUSD' && "Gold: 1 pip = $0.10 movement (e.g., 3330→3331 = 10 pips)"}
              {formData.instrument === 'XAGUSD' && "Silver: 1 pip = $0.01 movement"}
              {['EURUSD', 'GBPUSD', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP', 'AUDCAD', 'EURAUD', 'EURNZD', 'GBPAUD', 'GBPNZD'].includes(formData.instrument) && "Forex: 1 pip = 0.0001 movement (4th decimal)"}
              {['USDJPY', 'EURJPY', 'GBPJPY', 'CADJPY', 'CHFJPY'].includes(formData.instrument) && "JPY pairs: 1 pip = 0.01 movement (2nd decimal)"}
              {['DJ30', 'NAS100', 'DAX40', 'FTSE100', 'NIK225', 'ASX200', 'HK50'].includes(formData.instrument) && "Index: 1 point = 10 pips (0.1 point = 1 pip)"}
              {formData.instrument === 'SPX500' && "S&P 500: 1 point = 10 pips (0.1 point = 1 pip)"}
              {['USOIL', 'UKOIL'].includes(formData.instrument) && "Oil: 1 pip = $0.01 movement"}
              {formData.instrument === 'NATGAS' && "Natural Gas: 1 pip = $0.001 movement"}
              {formData.instrument === 'COPPER' && "Copper: 1 pip = $0.0001 movement"}
              {formData.instrument === 'BTCUSD' && "Bitcoin: 1 pip = $1 movement"}
              {formData.instrument === 'ETHUSD' && "Ethereum: 1 pip = $0.10 movement"}
              {formData.instrument === 'LTCUSD' && "Litecoin: 1 pip = $0.01 movement"}
              {formData.instrument === 'ADAUSD' && "Cardano: 1 pip = $0.0001 movement"}
              {formData.instrument === 'DOTUSD' && "Polkadot: 1 pip = $0.001 movement"}
              <div className="text-[10px] mt-1 text-gray-600">
                {formData.type === 'BUY' ? '📈 BUY: Profit when price goes up' : '📉 SELL: Profit when price goes down'}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">Profit/Loss (USD) *</label>
            <input
              type="number"
              step="0.01"
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white text-lg font-medium focus:outline-none focus:border-cyan-400 transition-all"
              value={formData.profit}
              onChange={(e) => setFormData({...formData, profit: e.target.value})}
              placeholder="Enter P&L (negative for loss)"
            />
            <p className="text-xs text-gray-500 mt-2">Enter negative value for losses (e.g., -50)</p>
          </div>
          
          {/* Live Pip Calculation Display */}
          {formData.entryPrice && formData.exitPrice && (
            <div className={`border rounded-xl p-3 ${
              calculatedPips >= 0 
                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
                : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Calculated Pips:</span>
                <span className={`text-lg font-bold ${
                  calculatedPips >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {calculatedPips >= 0 ? '+' : ''}{calculatedPips.toFixed(1)} pips
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formData.type} {formData.instrument}: {formData.entryPrice} → {formData.exitPrice}
              </div>
            </div>
          )}
          
          {formData.profit && (
            <div className={`border rounded-2xl p-4 backdrop-blur-sm ${
              parseFloat(formData.profit) >= 0 
                ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30' 
                : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30'
            }`}>
              <p className={`text-sm font-semibold mb-2 ${
                parseFloat(formData.profit) >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                Trade Summary
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">P&L:</span>
                  <span className={`font-bold text-lg ${parseFloat(formData.profit) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {parseFloat(formData.profit || '0') >= 0 ? '+' : ''}${parseFloat(formData.profit || '0').toFixed(2)}
                  </span>
                </div>
                {parseFloat(formData.profit) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Saved ({compoundingPercent}%):</span>
                    <span className="font-medium text-cyan-400">
                      ${(parseFloat(formData.profit) * compoundingPercent / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                {formData.entryPrice && formData.exitPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Pips:</span>
                    <span className={`font-medium ${calculatedPips >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {calculatedPips >= 0 ? '+' : ''}{calculatedPips.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              {parseFloat(formData.profit) < 0 && Math.abs(parseFloat(formData.profit)) > remainingAllowance && (
                <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-xs text-red-400 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    Exceeds daily risk limit!
                  </p>
                </div>
              )}
            </div>
          )}
          
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

// Trading Dashboard Component
const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
@@ -35,8 +471,8 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
// Load user settings
useEffect(() => {
const loadSettings = async () => {
      console.log('User object:', user);
      console.log('User ID:', getUserId(user));
      console.log('User object:', user); // Check what user object contains
      console.log('User ID:', getUserId(user)); // Check the extracted user ID

const userId = getUserId(user);
if (!userId) {
@@ -59,57 +495,77 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
setCapital(data.capital !== null ? Number(data.capital) : 1000);
setRiskPercent(data.risk_percent !== null ? Number(data.risk_percent) : 5);
setCompoundingPercent(data.compounding_percent !== null ? Number(data.compounding_percent) : 50);
        console.log('Settings applied:', {
          capital: data.capital,
          risk: data.risk_percent,
          compounding: data.compounding_percent
        });
}
      setLoading(false);
};

loadSettings();
}, [user]);
  
  // Load trades

  // Load trades on mount
useEffect(() => {
    const loadTrades = async () => {
    loadTrades();
  }, [user]);

  const loadTrades = async () => {
    try {
const userId = getUserId(user);
      if (!userId) return;
      if (!userId) {
        console.error('No user ID found for loading trades!');
        setLoading(false);
        return;
      }

const { data, error } = await supabase
.from('trades')
.select('*')
.eq('user_id', userId)
.order('created_at', { ascending: false });
      
      if (data) {
        setTrades(data);

      if (error) {
        console.error('Error loading trades:', error);
      } else {
        setTrades(data || []);
}
    };
    
    loadTrades();
  }, [user]);
  
    } catch (error) {
      console.error('Error loading trades:', error);
    }
    setLoading(false);
  };

// Save settings function
const saveSettings = async () => {
const userId = getUserId(user);
if (!userId) {
      console.error('No user ID found, cannot save settings');
      alert('User ID not found!');
return;
}

    console.log('Saving settings:', { capital, riskPercent, compoundingPercent });
    const valuesToSave = {
      capital: Number(capital),
      risk_percent: Number(riskPercent),
      compounding_percent: Number(compoundingPercent)
    };
    
    console.log('Saving for user:', userId);
    console.log('Values to save:', valuesToSave);

const { data, error } = await supabase
.from('profiles')
      .update({
        capital: capital,
        risk_percent: riskPercent,
        compounding_percent: compoundingPercent
      })
      .eq('id', userId);
      .update(valuesToSave)
      .eq('id', userId)
      .select(); // Add .select() to see what was updated

if (error) {
      console.error('Error saving settings:', error);
      console.error('Save error:', error);
alert('Failed to save settings: ' + error.message);
} else {
      console.log('Settings saved successfully');
      console.log('Save successful:', data);
      alert('Settings saved successfully!');

// Optionally reload settings to confirm they persisted
const { data: reloadData } = await supabase
@@ -230,52 +686,40 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
<path d="M20 38 L18 32 L20 34 L22 32 Z" fill="currentColor"/>
<path d="M2 20 L8 22 L6 20 L8 18 Z" fill="currentColor"/>
<circle cx="20" cy="20" r="2" fill="currentColor"/>
                    <path d="M20 8 L24 20 L20 32 L16 20 Z" fill="url(#compassGradient)" opacity="0.8"/>
                    <path d="M8 28 L12 24 L16 26 L20 20 L24 22 L28 18 L32 20" 
                          fill="none" 
                          stroke="rgba(34, 197, 94, 0.6)" 
                          strokeWidth="1.5"
                          opacity="0.7"/>
                    <defs>
                      <linearGradient id="compassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee"/>
                        <stop offset="100%" stopColor="#3b82f6"/>
                      </linearGradient>
                    </defs>
</svg>
</div>
</div>

              {/* App Title and User Info */}
<div>
                <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
Golden Compass
</h1>
                <p className="text-xs md:text-sm text-gray-400">
                  Welcome back, {user?.user_metadata?.name || user?.email || 'Trader'}
                <h2 className="text-sm md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 mb-1 md:mb-2">
                  Trading Command Center
                </h2>
                <p className="text-gray-400 flex items-center gap-2 text-xs md:text-base">
                  <Brain size={14} className="text-cyan-400 md:w-4 md:h-4" />
                  Welcome back, {user.user_metadata?.name || user.email}
</p>
</div>
              
              {/* Live Balance */}
              <div className="hidden lg:flex items-center gap-4 ml-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="text-lg font-bold text-white">${(capital + totalPL).toLocaleString()}</p>
                  <span className={`text-sm ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalPL > 0 ? '+' : ''}{totalPL.toFixed(0)}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Total P&L</p>
                  <span className={`text-lg font-bold ${
                    capital > 0 ? ((totalPL / capital) * 100 >= 0 ? 'text-green-400' : 'text-red-400') : 'text-gray-400'
                  }`}>
                    {capital > 0 ? ((totalPL / capital) * 100).toFixed(1) : '0.0'}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Today</span>
                  <span className={`font-semibold ${todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {todayPL >= 0 ? '+' : ''}${todayPL.toFixed(0)}
                  </span>
                </div>
              </div>
</div>
            
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2">
            <div className="w-full md:w-auto md:text-right">
              <div className="flex flex-wrap items-center gap-2 mb-2">
<button
onClick={() => setShowQuickSettings(!showQuickSettings)}
                  className="flex items-center gap-1 md:gap-2 text-xs px-2 md:px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-all"
                  className="flex items-center gap-1 md:gap-2 text-xs px-2 md:px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all"
>
<Settings size={12} className="md:w-3.5 md:h-3.5" />
<span className="hidden sm:inline">Quick</span> Settings
@@ -314,63 +758,393 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
</div>
<button
onClick={() => setShowQuickSettings(false)}
                className="text-gray-400 hover:text-white transition-colors"
                className="text-gray-400 hover:text-white transition-all p-1 hover:bg-white/10 rounded"
>
<X size={16} />
</button>
</div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
                <label className="block text-xs text-gray-400 mb-1">Trading Capital</label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <label className="text-xs text-gray-400 mb-1 block">Starting Capital</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">$</span>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-black/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500/50 transition-all"
                  />
                </div>
</div>
<div>
                <label className="block text-xs text-gray-400 mb-1">Daily Risk %</label>
                <input
                  type="number"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  min="0"
                  max="100"
                  step="0.1"
                <label className="text-xs text-gray-400 mb-1 block">Daily Risk Limit (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-black/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-yellow-500/50 transition-all"
                    min={1}
                    max={100}
                    step={0.5}
                  />
                  <span className="text-gray-400">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">= ${dailyLimit.toFixed(2)} max loss</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Compounding Rate (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={compoundingPercent}
                    onChange={(e) => setCompoundingPercent(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-black/50 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-purple-500/50 transition-all"
                    min={0}
                    max={100}
                    step={5}
                  />
                  <span className="text-gray-400">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">of profits saved</p>
              </div>
            </div>
            <button
              onClick={saveSettings}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-2 rounded-lg font-semibold transition-all"
            >
              💾 SAVE ALL SETTINGS
            </button>
          </div>
        )}
        
        {/* Motivational Quote Section */}
        <div className="mb-6 relative overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 rounded-3xl p-4 md:p-8 border border-purple-500/20 text-center">
            <div className="absolute top-4 left-8 text-6xl text-purple-400/20 font-serif">"</div>
            <div className="absolute bottom-4 right-8 text-6xl text-purple-400/20 font-serif transform rotate-180">"</div>
            <div className="relative z-10">
              <blockquote className="text-base md:text-xl lg:text-2xl font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-4 leading-relaxed tracking-wide" style={{fontFamily: "'Playfair Display', 'Georgia', serif", fontStyle: 'italic', letterSpacing: '0.02em'}}>
                The market is a device for transferring money from the impatient to the patient. Master your emotions, follow your strategy, and let time be your greatest ally.
              </blockquote>
              <cite className="text-sm text-purple-400/80 font-medium tracking-widest uppercase" style={{fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em'}}>
                — Golden Compass Wisdom
              </cite>
            </div>
          </div>
        </div>
        
        {/* Account Health Oscillator */}
        <div className="mb-6 bg-gray-900/80 rounded-3xl p-4 md:p-6 border border-gray-800 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  (() => {
                    // Calculate health score
                    let healthScore = 0;
                    
                    // Win rate contribution (0-30 points)
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    
                    // Risk management (0-25 points) - better when lower risk used
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    
                    // ROI contribution (0-25 points)
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    
                    // Today's performance (0-20 points)
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'bg-green-500/20';
                    if (healthScore >= 60) return 'bg-yellow-500/20';
                    if (healthScore >= 40) return 'bg-orange-500/20';
                    return 'bg-red-500/20';
                  })()
                }`}>
                  <div className={`text-2xl ${
                    (() => {
                      let healthScore = 0;
                      healthScore += Math.min(stats.winRate * 0.3, 30);
                      healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                      const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                      healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                      if (todayPL >= 0) {
                        healthScore += Math.min(todayPL / 10, 20);
                      } else {
                        healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                      }
                      healthScore = Math.max(0, Math.min(100, healthScore));
                      
                      if (healthScore >= 80) return 'text-green-400';
                      if (healthScore >= 60) return 'text-yellow-400';
                      if (healthScore >= 40) return 'text-orange-400';
                      return 'text-red-400';
                    })()
                  }`}>
                    ⚡
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Account Health Monitor</h2>
                  <p className="text-sm text-gray-400">Live performance oscillator</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl md:text-3xl font-bold ${
                  (() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'text-green-400';
                    if (healthScore >= 60) return 'text-yellow-400';
                    if (healthScore >= 40) return 'text-orange-400';
                    return 'text-red-400';
                  })()
                }`}>
                  {(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    return Math.max(0, Math.min(100, healthScore)).toFixed(0);
                  })()}%
                </div>
                <div className="text-sm text-gray-400">
                  {(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'STRONG';
                    if (healthScore >= 60) return 'STABLE';
                    if (healthScore >= 40) return 'WEAK';
                    return 'CRITICAL';
                  })()}
                </div>
              </div>
            </div>
            
            {/* Heartbeat Oscillator */}
            <div className="bg-black/50 rounded-2xl p-4 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>
              <svg 
                className="w-full h-20" 
                viewBox="0 0 800 80"
              >
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Heartbeat line */}
                <path
                  d={(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    // Generate heartbeat pattern based on health
                    const amplitude = Math.max(5, healthScore * 0.3);
                    
                    let path = "M 0,40";
                    for (let x = 0; x <= 800; x += 4) {
                      // Create heartbeat spikes every ~100 pixels
                      const beatPosition = (x % 120);
                      let y = 40;
                      
                      if (beatPosition > 40 && beatPosition < 80) {
                        if (beatPosition < 50) {
                          y = 40 - amplitude * 0.3; // Small pre-spike
                        } else if (beatPosition < 55) {
                          y = 40 + amplitude; // Main spike up
                        } else if (beatPosition < 60) {
                          y = 40 - amplitude * 1.5; // Sharp dip
                        } else if (beatPosition < 65) {
                          y = 40 + amplitude * 0.8; // Secondary spike
                        } else {
                          y = 40 - amplitude * 0.2; // Settle
                        }
                      }
                      
                      path += ` L ${x},${Math.max(5, Math.min(75, y))}`;
                    }
                    return path;
                  })()}
                  fill="none"
                  stroke={(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return '#22c55e';
                    if (healthScore >= 60) return '#eab308';
                    if (healthScore >= 40) return '#f97316';
                    return '#ef4444';
                  })()}
                  strokeWidth="2"
                  className="animate-pulse"
/>
                
                {/* Moving indicator dot */}
                <circle
                  cx="700"
                  cy="40"
                  r="3"
                  fill={(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return '#22c55e';
                    if (healthScore >= 60) return '#eab308';
                    if (healthScore >= 40) return '#f97316';
                    return '#ef4444';
                  })()}
                  className="animate-pulse"
                  style={{filter: 'drop-shadow(0 0 6px currentColor)'}}
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values="-700,0; 100,0; -700,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
              
              {/* Oscillator readings */}
              <div className="flex justify-between items-center mt-2 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400">LIVE</span>
                  </div>
                  <span className="text-gray-500 font-mono">
                    BPM: {(() => {
                      let healthScore = 0;
                      healthScore += Math.min(stats.winRate * 0.3, 30);
                      healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                      const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                      healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                      if (todayPL >= 0) {
                        healthScore += Math.min(todayPL / 10, 20);
                      } else {
                        healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                      }
                      healthScore = Math.max(0, Math.min(100, healthScore));
                      return Math.round(60 + (healthScore * 0.8));
                    })()}
                  </span>
                </div>
                <span className="text-gray-500 font-mono">AMP: {(() => {
                  let healthScore = 0;
                  healthScore += Math.min(stats.winRate * 0.3, 30);
                  healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                  const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                  healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                  if (todayPL >= 0) {
                    healthScore += Math.min(todayPL / 10, 20);
                  } else {
                    healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                  }
                  healthScore = Math.max(0, Math.min(100, healthScore));
                  return (Math.max(5, healthScore * 0.3)).toFixed(1);
                })()}mV</span>
              </div>
            </div>
            
            {/* Health Factors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className={`font-semibold ${stats.winRate >= 60 ? 'text-green-400' : stats.winRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {stats.winRate.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Risk Usage</span>
                <span className={`font-semibold ${riskUsed <= 30 ? 'text-green-400' : riskUsed <= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {riskUsed.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ROI</span>
                <span className={`font-semibold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {capital > 0 ? ((totalPL / capital) * 100).toFixed(1) : '0.0'}%
                </span>
</div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Compounding %</label>
                <input
                  type="number"
                  value={compoundingPercent}
                  onChange={(e) => setCompoundingPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  min="0"
                  max="100"
                />
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Today</span>
                <span className={`font-semibold ${todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {todayPL >= 0 ? '+' : ''}${todayPL.toFixed(0)}
                </span>
</div>
</div>
            
            <button
              onClick={() => {
                saveSettings();
                setShowQuickSettings(false);
              }}
              className="mt-3 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-2 rounded-lg font-medium transition-all"
            >
              Apply Changes
            </button>
</div>
        )}
        
        </div>
<div className="mb-6">
<TradingCalendar trades={trades} />
</div>
        
{/* Main Metrics Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
{/* Capital Card */}
@@ -473,20 +1247,30 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
</div>
<p className="text-sm text-gray-400 mb-2">Daily Risk Limit</p>
<p className="text-xl md:text-3xl font-bold text-white">${dailyLimit.toFixed(2)}</p>
              <p className={`text-sm mt-2 ${
                riskUsed > 80 ? 'text-red-400' :
                riskUsed > 50 ? 'text-orange-400' :
                'text-gray-400'
              }`}>
                Remaining: ${remainingAllowance.toFixed(2)}
              </p>
{showRiskEdit && (
<div className="mt-3">
                  <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-white"
                    onBlur={() => setShowRiskEdit(false)}
                    autoFocus
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage of capital at risk per day</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-black/50 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-white"
                      min={1}
                      max={100}
                      step={0.5}
                      onBlur={() => setShowRiskEdit(false)}
                      autoFocus
                    />
                    <span className="text-sm text-gray-400">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max daily loss as % of capital</p>
</div>
)}
<div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
@@ -544,69 +1328,107 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
<p className="text-lg md:text-xl font-bold text-purple-400">${saved.toFixed(2)}</p>
{showCompoundingEdit && (
<div className="mt-2">
                <input
                  type="number"
                  value={compoundingPercent}
                  onChange={(e) => setCompoundingPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-white"
                  onBlur={() => setShowCompoundingEdit(false)}
                  autoFocus
                  min="0"
                  max="100"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={compoundingPercent}
                    onChange={(e) => setCompoundingPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-purple-500/30 rounded px-2 py-1 text-xs text-white"
                    min={0}
                    max={100}
                    step={5}
                    onBlur={() => setShowCompoundingEdit(false)}
                    autoFocus
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">% of profits to save</p>
</div>
)}
</div>

{/* Today P&L */}
<div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
<div className="flex items-center justify-between mb-2">
              <Clock size={18} className="text-cyan-400" />
              <span className="text-xs text-gray-400">24h</span>
              <Clock size={18} className="text-indigo-400" />
              <span className="text-xs text-gray-500">24H</span>
</div>
<p className="text-xs text-gray-400 mb-1">Today P&L</p>
            <p className={`text-lg md:text-xl font-bold ${todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {todayPL >= 0 ? '+' : ''}${todayPL.toFixed(2)}
            <p className={`text-lg md:text-xl font-bold ${todayPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {todayPL >= 0 ? '+' : ''}${Math.abs(todayPL).toFixed(2)}
</p>
</div>

{/* Total Trades */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-blue-500/30 transition-all">
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
<div className="flex items-center justify-between mb-2">
              <Activity size={18} className="text-blue-400" />
              <span className="text-xs text-gray-400">ALL</span>
              <Activity size={18} className="text-orange-400" />
              <span className="text-xs text-gray-500">ALL</span>
</div>
            <p className="text-xs text-gray-400 mb-1">Total Trades</p>
            <p className="text-lg md:text-xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400 mb-1">Trades</p>
            <p className="text-lg md:text-xl font-bold text-orange-400">{stats.total}</p>
</div>

          {/* Remaining Allowance */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-orange-500/30 transition-all">
          {/* Total P&L */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
<div className="flex items-center justify-between mb-2">
              <Target size={18} className="text-orange-400" />
              <span className="text-xs text-gray-400">LEFT</span>
              <TrendingUp size={18} className="text-cyan-400" />
              <span className="text-xs text-gray-500">ROI</span>
</div>
            <p className="text-xs text-gray-400 mb-1">Risk Allowance</p>
            <p className="text-lg md:text-xl font-bold text-orange-400">${remainingAllowance.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mb-1">Total P&L</p>
            <p className={`text-lg md:text-xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}${Math.abs(totalPL).toFixed(2)}
            </p>
</div>

          {/* Total P&L */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-green-500/30 transition-all">
          {/* ROI */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
<div className="flex items-center justify-between mb-2">
              <TrendingUp size={18} className="text-green-400" />
              <span className="text-xs text-gray-400">NET</span>
              <Target size={18} className="text-pink-400" />
              <span className="text-xs text-gray-500">%</span>
</div>
            <p className="text-xs text-gray-400 mb-1">Total P&L</p>
            <p className={`text-lg md:text-xl font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
            <p className="text-xs text-gray-400 mb-1">Return</p>
            <p className={`text-lg md:text-xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {capital > 0 ? ((totalPL / capital) * 100).toFixed(1) : '0.0'}%
</p>
</div>
</div>

        {/* New Trade Button */}
        {/* Critical Market News */}
        <div className="mb-6 bg-gray-900/60 rounded-2xl p-3 md:p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              Critical Market News
            </h3>
            <span className="text-xs text-gray-400 bg-red-500/10 px-2 py-1 rounded-full">LIVE</span>
          </div>
          <div className="space-y-3">
            <div className="bg-black/40 rounded-xl p-3 border-l-4 border-red-400">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white mb-1">Fed Interest Rate Decision Pending</p>
                  <p className="text-xs text-gray-400">Markets volatile ahead of FOMC announcement • 2 hours ago</p>
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">HIGH</span>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border-l-4 border-yellow-400">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white mb-1">Major Bank Earnings This Week</p>
                  <p className="text-xs text-gray-400">JPM, BAC, WFC reporting • Could impact financials sector • 6 hours ago</p>
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">MED</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Trade Button */}
<button
onClick={() => setShowAddTrade(true)}
          className="w-full mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-3xl p-4 flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-500/20"
          className="mb-6 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 md:px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-500/20"
>
<div className="p-2 bg-white/10 rounded-lg">
<Plus size={18} className="md:w-5 md:h-5" />
@@ -674,231 +1496,6 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
)}
</div>

          {/* Performance Sidebar */}
          <div className="space-y-6">
            {/* Account Health Oscillator */}
            <div className="bg-gray-900/60 rounded-3xl border border-gray-800 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    (() => {
                      let healthScore = 0;
                      healthScore += Math.min(stats.winRate * 0.3, 30);
                      healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                      const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                      healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                      if (todayPL >= 0) {
                        healthScore += Math.min(todayPL / 10, 20);
                      } else {
                        healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                      }
                      healthScore = Math.max(0, Math.min(100, healthScore));
                      
                      if (healthScore >= 80) return 'bg-green-500/20';
                      if (healthScore >= 60) return 'bg-yellow-500/20';
                      if (healthScore >= 40) return 'bg-orange-500/20';
                      return 'bg-red-500/20';
                    })()
                  }`}>
                    <div className={`text-lg ${
                      (() => {
                        let healthScore = 0;
                        healthScore += Math.min(stats.winRate * 0.3, 30);
                        healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                        const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                        healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                        if (todayPL >= 0) {
                          healthScore += Math.min(todayPL / 10, 20);
                        } else {
                          healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                        }
                        healthScore = Math.max(0, Math.min(100, healthScore));
                        
                        if (healthScore >= 80) return 'text-green-400';
                        if (healthScore >= 60) return 'text-yellow-400';
                        if (healthScore >= 40) return 'text-orange-400';
                        return 'text-red-400';
                      })()
                    }`}>
                      ⚡
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Account Health Monitor</h2>
                  <p className="text-sm text-gray-400">Live performance oscillator</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl md:text-3xl font-bold ${
                  (() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'text-green-400';
                    if (healthScore >= 60) return 'text-yellow-400';
                    if (healthScore >= 40) return 'text-orange-400';
                    return 'text-red-400';
                  })()
                }`}>
                  {(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    return Math.max(0, Math.min(100, healthScore)).toFixed(0);
                  })()}%
                </div>
                <div className="text-sm text-gray-400">
                  {(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'STRONG';
                    if (healthScore >= 60) return 'STABLE';
                    if (healthScore >= 40) return 'WEAK';
                    return 'CRITICAL';
                  })()}
                </div>
              </div>
            </div>
            
            {/* Heartbeat Oscillator */}
            <div className="bg-black/50 rounded-2xl p-4 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>
              <svg 
                className="w-full h-20" 
                viewBox="0 0 800 80"
              >
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Heartbeat line */}
                <path
                  d={(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    const amplitude = Math.max(5, healthScore * 0.3);
                    const frequency = Math.max(0.8, healthScore * 0.02);
                    
                    let path = `M 0 40`;
                    for (let x = 0; x <= 800; x += 10) {
                      const y = 40 + Math.sin(x * frequency * 0.01) * amplitude;
                      path += ` L ${x} ${y}`;
                    }
                    return path;
                  })()}
                  fill="none"
                  stroke="rgba(34, 197, 94, 0.8)"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-center mt-2">
                <span className={`text-sm font-mono ${
                  (() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    
                    if (healthScore >= 80) return 'text-green-400';
                    if (healthScore >= 60) return 'text-yellow-400';
                    if (healthScore >= 40) return 'text-orange-400';
                    return 'text-red-400';
                  })()
                }`}>
                  {(() => {
                    let healthScore = 0;
                    healthScore += Math.min(stats.winRate * 0.3, 30);
                    healthScore += Math.max(0, 25 - (riskUsed * 0.25));
                    const roi = capital > 0 ? (totalPL / capital) * 100 : 0;
                    healthScore += Math.min(Math.max(roi, 0) * 0.5, 25);
                    if (todayPL >= 0) {
                      healthScore += Math.min(todayPL / 10, 20);
                    } else {
                      healthScore -= Math.min(Math.abs(todayPL) / 10, 20);
                    }
                    healthScore = Math.max(0, Math.min(100, healthScore));
                    return (Math.max(5, healthScore * 0.3)).toFixed(1);
                  })()}mV</span>
              </div>
            </div>
            
            {/* Health Factors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className={`font-semibold ${stats.winRate >= 60 ? 'text-green-400' : stats.winRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {stats.winRate.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Risk Usage</span>
                <span className={`font-semibold ${riskUsed <= 30 ? 'text-green-400' : riskUsed <= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {riskUsed.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ROI</span>
                <span className={`font-semibold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {capital > 0 ? ((totalPL / capital) * 100).toFixed(1) : '0.0'}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Today</span>
                <span className={`font-semibold ${todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {todayPL >= 0 ? '+' : ''}${todayPL.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          
{/* Instructor Performance */}
<div className="bg-gray-900/60 rounded-3xl border border-gray-800 p-4 md:p-6">
<h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
@@ -917,9 +1514,7 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
<div className="flex items-center justify-between mb-2">
<div className="flex items-center gap-2 md:gap-3">
<div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                          index === 2 ? 'bg-gradient-to-br from-yellow-600 to-yellow-800' : 'bg-gray-700'
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-700'
                       }`}>
{index + 1}
</div>
@@ -953,29 +1548,38 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
It is NOT financial advice, investment recommendation, or trading guidance. All trading decisions are your own responsibility. 
Past performance does not guarantee future results. Trading involves substantial risk of loss.
</p>
              <p className="text-gray-500">
                Always consult with a qualified financial advisor before making investment decisions. The creators of this application are not responsible for any trading losses or gains.
              </p>
</div>

            {/* App Info */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Golden Compass Trading Journal v1.0 • 
                <span className="text-cyan-400"> Professional Trading Analytics</span>
              </p>
            {/* Company Attribution */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm font-semibold text-gray-300">Made by</p>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    SM INTERNATIONAL LLC
                  </p>
                  <p className="text-xs text-gray-400">FLORIDA, USA</p>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-sm font-semibold text-gray-300">Contributions & Ideas by</p>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    KRISTIJAN STAVRESKI
                  </p>
                </div>
              </div>
</div>
</div>
</div>
</footer>

      
{/* Support Ticket Modal */}
{showSupportTicket && (
<div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-blue-500/20 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl shadow-blue-500/10 max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-blue-500/20 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl shadow-blue-500/10 max-h-[90vh] overflow-y-auto">
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                Support Request
                Support Ticket
</h2>
<button 
onClick={() => setShowSupportTicket(false)} 
@@ -986,6 +1590,25 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
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
@@ -1050,7 +1673,7 @@ const TradingDashboard = ({ user, onLogout }: { user: any, onLogout: () => void
</div>
)}

      {/* ✅ UPDATED: Use the extracted AddTradeForm component */}
      {/* Add Trade Form Modal */}
<AddTradeForm 
showAddTrade={showAddTrade}
setShowAddTrade={setShowAddTrade}
