import React from "react";

const MotivationalQuote: React.FC = () => (
  <div className="mb-6 relative overflow-hidden">
    <div className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 rounded-3xl p-4 md:p-8 border border-purple-500/20 text-center">
      <div className="absolute top-4 left-8 text-6xl text-purple-400/20 font-serif">"</div>
      <div className="absolute bottom-4 right-8 text-6xl text-purple-400/20 font-serif transform rotate-180">"</div>
      <div className="relative z-10">
        <blockquote className="text-base md:text-xl lg:text-2xl font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-4 leading-relaxed tracking-tight">
          The market is a device for transferring money from the impatient to the patient. Master your emotions, follow your strategy, and let time be your greatest ally.
        </blockquote>
        <cite className="text-sm text-purple-400/80 font-medium tracking-widest uppercase" style={{fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em'}}>
          — Golden Compass Wisdom
        </cite>
      </div>
    </div>
  </div>
);

export default MotivationalQuote;
