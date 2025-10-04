import React from 'react';
import { Loader2, TrendingUp, Calculator, Sparkles } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main Spinner */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-8 border-white/20 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-spin">
            <div className="w-32 h-32 border-8 border-transparent border-t-white border-r-white rounded-full"></div>
          </div>
          <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
            <Calculator className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        {/* Animated Icons */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="animate-bounce" style={{ animationDelay: '0s' }}>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>
            <Sparkles className="w-6 h-6 text-white/80" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Calculator className="w-6 h-6 text-white/80" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-white text-2xl font-bold mb-3 animate-pulse">
          Analizujemy Twoją przyszłość...
        </h2>
        <p className="text-white/80 text-lg">
          Obliczamy prognozy emerytalne
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
