import React, { useState } from 'react';
    import { GeneratedImage } from '../types';
    import { RefreshCw, Check, AlertCircle } from 'lucide-react';
    
    interface Props {
      images: GeneratedImage[];
      onSelect: (image: GeneratedImage) => void;
      onRegenerate: () => void;
      regenCount: number;
      maxRegen: number;
    }
    
    const StepResult: React.FC<Props> = ({ images, onSelect, onRegenerate, regenCount, maxRegen }) => {
      const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
      return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto p-4 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">ロゴが完成しました</h2>
            <p className="text-sm text-slate-500 mt-1">気に入ったデザインを選択してください</p>
          </div>
    
          {/* Image Grid */}
          <div className="space-y-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setSelectedIndex(idx)}
                className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  selectedIndex === idx
                    ? 'border-rose-500 shadow-lg scale-[1.02]'
                    : 'border-slate-200 shadow-sm hover:border-rose-200'
                }`}
              >
                {/* Checkbox Overlay */}
                <div className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    selectedIndex === idx ? 'bg-rose-500 text-white' : 'bg-white/80 text-transparent border border-slate-300'
                }`}>
                    <Check className="w-5 h-5" />
                </div>

                {/* Background Checkerboard for transparency visualization */}
                <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard-white-gray.png')] opacity-20"></div>
                
                <img
                  src={img.processedBase64}
                  alt={`Logo Option ${idx + 1}`}
                  className="w-full h-auto relative z-1 p-4 bg-transparent object-contain aspect-square"
                />
              </div>
            ))}
          </div>
    
          {/* Actions */}
          <div className="space-y-3 pt-4 pb-8">
            <button
              onClick={() => selectedIndex !== null && onSelect(images[selectedIndex])}
              disabled={selectedIndex === null}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                selectedIndex !== null
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5" />
              このロゴを使う
            </button>
    
            {regenCount < maxRegen ? (
              <button
                onClick={onRegenerate}
                className="w-full py-3 px-6 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                もう一度生成する (残り{maxRegen - regenCount}回)
              </button>
            ) : (
                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3"/>
                    再生成回数の上限に達しました
                </p>
            )}
          </div>
        </div>
      );
    };
    
    export default StepResult;
    