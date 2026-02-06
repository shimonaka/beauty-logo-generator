import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, Mail, CheckCircle2, ArrowRight, Smartphone, Laptop, FileText } from 'lucide-react';

interface Props {
  image: GeneratedImage;
}

const StepDownload: React.FC<Props> = ({ image }) => {
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.processedBase64;
    link.download = `salon-logo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate email submission logic here
    setIsEmailSent(true);
    setTimeout(() => setIsEmailSent(false), 3000);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-4 space-y-8 pb-12">
      {/* Success Message */}
      <div className="text-center space-y-2 animate-in slide-in-from-top-4 fade-in duration-500">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ロゴが完成しました！</h1>
        <p className="text-sm text-slate-500">ダウンロードして自由にお使いください</p>
      </div>

      {/* Preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard-white-gray.png')] opacity-20 z-0"></div>
        <img src={image.processedBase64} alt="Final Logo" className="w-48 h-48 object-contain relative z-10" />
      </div>

      {/* Primary Action */}
      <button
        onClick={handleDownload}
        className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-rose-500 text-white shadow-lg hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Download className="w-6 h-6" />
        PNGをダウンロード
      </button>

      <hr className="border-slate-200" />

      {/* Lead Gen - Email */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-slate-400 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-slate-700">メールでも受け取る（任意）</h3>
            <p className="text-xs text-slate-500 mt-1">パソコンへの転送や保存用に便利です</p>
          </div>
        </div>

        {!isEmailSent ? (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
            />
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                className="mt-1 rounded text-rose-500 focus:ring-rose-500"
              />
              <span className="text-xs text-slate-500 leading-snug">
                開業準備に役立つ情報（集客ノウハウなど）も受け取る
              </span>
            </label>
            <button type="submit" className="w-full py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
              送信する
            </button>
          </form>
        ) : (
          <div className="text-center py-2 text-green-600 font-medium text-sm bg-green-50 rounded-lg">
            メールを送信しました！
          </div>
        )}
      </div>

      <hr className="border-slate-200" />

      {/* Cross-sell / Soft-sell */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">開店準備、お疲れさまです。</p>
          <p className="text-xs text-slate-500 mt-1">私たちがお手伝いできることがあります。</p>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Laptop className="w-4 h-4" /></div>
            <span className="text-sm text-slate-600 font-medium">ホームページ制作</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><FileText className="w-4 h-4" /></div>
            <span className="text-sm text-slate-600 font-medium">チラシ・フライヤー制作</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
            <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><Smartphone className="w-4 h-4" /></div>
            <span className="text-sm text-slate-600 font-medium">求人パンフレット制作</span>
          </div>
        </div>

        <a href="/promotion/index.html" className="w-full py-3 border border-slate-300 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm">
          相談してみる <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default StepDownload;
