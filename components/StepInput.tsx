import React, { useState } from 'react';
import { StyleId, ColorId, FormData } from '../types';
import { STYLE_OPTIONS, COLOR_OPTIONS } from '../constants';
import { Wand2 } from 'lucide-react';

interface Props {
  onNext: (data: FormData) => void;
}

const StepInput: React.FC<Props> = ({ onNext }) => {
  const [storeName, setStoreName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleId | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorId | null>(null);

  const canProceed = storeName.trim().length > 0 && selectedStyle && selectedColor;

  const handleSubmit = () => {
    if (canProceed) {
      onNext({
        storeName,
        style: selectedStyle,
        color: selectedColor
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">ロゴを作成する</h1>
        <p className="text-sm text-slate-500">美容室のための無料ロゴジェネレーター</p>
      </div>

      {/* 1. Store Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          店名を入力 <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="例：AUBE / Hair Salon Reir"
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 2. Style Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          スタイルを選択 <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-3 text-sm rounded-lg border transition-all duration-200 text-left ${
                selectedStyle === style.id
                  ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Color Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          色味を選択 <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`p-3 flex items-center gap-3 text-sm rounded-lg border transition-all duration-200 ${
                selectedColor === color.id
                  ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
              {color.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 pb-8 sticky bottom-0 bg-gradient-to-t from-[#f8fafc] to-transparent">
        <button
          onClick={handleSubmit}
          disabled={!canProceed}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform ${
            canProceed
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Wand2 className="w-5 h-5" />
          ロゴを生成する
        </button>
      </div>
    </div>
  );
};

export default StepInput;
