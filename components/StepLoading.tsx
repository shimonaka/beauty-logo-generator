import React, { useEffect, useState } from 'react';
import { LOADING_HINTS } from '../constants';
import { Scissors } from 'lucide-react';

const StepLoading: React.FC = () => {
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % LOADING_HINTS.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-8 space-y-12">
      {/* Animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-rose-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl border border-rose-100">
          <Scissors className="w-16 h-16 text-rose-500 animate-[spin_3s_linear_infinite]" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-800">
          あなたのロゴを作成しています…
        </h2>
        <p className="text-sm text-slate-500">これには15〜30秒ほどかかります</p>
      </div>

      {/* Hints */}
      <div className="w-full bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-rose-100 shadow-sm min-h-[100px] flex items-center">
        <p className="text-sm text-slate-700 leading-relaxed transition-opacity duration-500 animate-in fade-in slide-in-from-bottom-2" key={hintIndex}>
          {LOADING_HINTS[hintIndex]}
        </p>
      </div>
    </div>
  );
};

export default StepLoading;
