interface AccountHealthMonitorProps {
  stats: {
    winRate: number;
  };
  riskUsed: number;
  totalPL: number;
  capital: number;
  todayPL: number;
}

export default function AccountHealthMonitor({ stats, riskUsed, totalPL, capital, todayPL }: AccountHealthMonitorProps) {
  // Calculate health score
  const calculateHealthScore = () => {
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
    
    return Math.max(0, Math.min(100, healthScore));
  };

  const healthScore = calculateHealthScore();

  const getHealthColor = () => {
    if (healthScore >= 80) return 'text-green-400';
    if (healthScore >= 60) return 'text-yellow-400';
    if (healthScore >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthBgColor = () => {
    if (healthScore >= 80) return 'bg-green-500/20';
    if (healthScore >= 60) return 'bg-yellow-500/20';
    if (healthScore >= 40) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  const getHealthStatus = () => {
    if (healthScore >= 80) return 'STRONG';
    if (healthScore >= 60) return 'STABLE';
    if (healthScore >= 40) return 'WEAK';
    return 'CRITICAL';
  };

  const getHeartbeatColor = () => {
    if (healthScore >= 80) return '#22c55e';
    if (healthScore >= 60) return '#eab308';
    if (healthScore >= 40) return '#f97316';
    return '#ef4444';
  };

  const generateHeartbeatPath = () => {
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
  };

  return (
    <div className="mb-6 bg-gray-900/80 rounded-3xl p-4 md:p-6 border border-gray-800 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${getHealthBgColor()}`}>
              <div className={`text-2xl ${getHealthColor()}`}>
                ⚡
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Account Health Monitor</h2>
              <p className="text-sm text-gray-400">Live performance oscillator</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl md:text-3xl font-bold ${getHealthColor()}`}>
              {healthScore.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">
              {getHealthStatus()}
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
              d={generateHeartbeatPath()}
              fill="none"
              stroke={getHeartbeatColor()}
              strokeWidth="2"
              className="animate-pulse"
            />
            
            {/* Moving indicator dot */}
            <circle
              cx="700"
              cy="40"
              r="3"
              fill={getHeartbeatColor()}
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
                BPM: {Math.round(60 + (healthScore * 0.8))}
              </span>
            </div>
            <span className="text-gray-500 font-mono">
              AMP: {(Math.max(5, healthScore * 0.3)).toFixed(1)}mV
            </span>
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
    </div>
  );
}
