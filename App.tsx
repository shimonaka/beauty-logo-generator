import React, { useState, useEffect } from 'react';
import { AppStep, FormData, GeneratedImage } from './types';
import { generateLogos } from './services/geminiService';
import { processImage } from './utils/imageProcessing';
import StepInput from './components/StepInput';
import StepLoading from './components/StepLoading';
import StepResult from './components/StepResult';
import StepDownload from './components/StepDownload';
import { MAX_DAILY_LIMIT, MAX_REGEN_PER_SESSION } from './constants';
import { ShieldAlert } from 'lucide-react';

const STORAGE_KEY_DATE = 'logo_gen_date';
const STORAGE_KEY_COUNT = 'logo_gen_count';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [regenCount, setRegenCount] = useState(0);

  // Initialize daily count
  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(STORAGE_KEY_DATE);
    const count = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);

    if (lastDate === today) {
      setDailyCount(count);
    } else {
      localStorage.setItem(STORAGE_KEY_DATE, today);
      localStorage.setItem(STORAGE_KEY_COUNT, '0');
      setDailyCount(0);
    }
  }, []);

  const incrementDailyCount = () => {
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    localStorage.setItem(STORAGE_KEY_COUNT, newCount.toString());
  };

  const handleInputSubmit = async (data: FormData) => {
    if (dailyCount >= MAX_DAILY_LIMIT) {
      setStep(AppStep.LIMIT_REACHED);
      return;
    }
    setFormData(data);
    setRegenCount(0);
    await startGeneration(data, true);
  };

  const startGeneration = async (data: FormData, isNewSession: boolean) => {
    setStep(AppStep.LOADING);

    try {
      const rawImages = await generateLogos(data);

      const processedImages: GeneratedImage[] = await Promise.all(
        rawImages.map(async (raw, index) => {
          const processed = await processImage(
            raw.base64,
            data.storeName,
            data.style,
            raw.isJapaneseFallback
          );
          return {
            id: `${Date.now()}-${index}`,
            base64: raw.base64,
            processedBase64: processed,
            isJapaneseFallback: raw.isJapaneseFallback
          };
        })
      );

      setImages(processedImages);
      setStep(AppStep.RESULT);

      if (isNewSession) {
        incrementDailyCount();
      }
    } catch (error) {
      console.error("Generation failed", error);
      alert("エラーが発生しました。もう一度お試しください。");
      setStep(AppStep.INPUT);
    }
  };

  const handleRegenerate = async () => {
    if (!formData || regenCount >= MAX_REGEN_PER_SESSION) return;
    setRegenCount(prev => prev + 1);
    await startGeneration(formData, false); // False = doesn't consume daily limit
  };

  const handleSelectImage = (image: GeneratedImage) => {
    setSelectedImage(image);
    setStep(AppStep.DOWNLOAD);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-[480px] min-h-[100dvh] md:min-h-[800px] md:h-auto bg-white shadow-xl md:rounded-2xl overflow-hidden flex flex-col relative">

        {/* Header - Simple Branding */}
        <header className="px-6 py-4 border-b border-slate-100 flex justify-center">
          <span className="font-bold text-rose-500 tracking-wider">SALON LOGO MAKER</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">

          {step === AppStep.INPUT && (
            dailyCount >= MAX_DAILY_LIMIT
              ? <LimitReachedScreen />
              : <StepInput onNext={handleInputSubmit} />
          )}

          {step === AppStep.LIMIT_REACHED && <LimitReachedScreen />}

          {step === AppStep.LOADING && <StepLoading />}

          {step === AppStep.RESULT && (
            <StepResult
              images={images}
              onSelect={handleSelectImage}
              onRegenerate={handleRegenerate}
              regenCount={regenCount}
              maxRegen={MAX_REGEN_PER_SESSION}
            />
          )}

          {step === AppStep.DOWNLOAD && selectedImage && (
            <StepDownload image={selectedImage} />
          )}

        </main>
      </div>
    </div>
  );
}

const LimitReachedScreen = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 space-y-8 text-center">
    <div className="bg-rose-50 p-4 rounded-full">
      <ShieldAlert className="w-12 h-12 text-rose-500" />
    </div>
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-slate-800">本日の生成回数に達しました</h2>
      <p className="text-sm text-slate-500">
        明日また新しいロゴを作れます。<br />
        今日作ったロゴはダウンロードされましたか？
      </p>
    </div>

    <hr className="w-full border-slate-100" />

    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 w-full">
      <h3 className="font-bold text-slate-700 mb-2">💡 もっと本格的なロゴをお求めなら</h3>
      <p className="text-xs text-slate-500 mb-4">
        プロのデザイナーがあなたの想いを形にします。<br />
        修正回数無制限、名刺や看板データも作成可能。
      </p>
      <a href="/promotion/index.html" className="block w-full text-center py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50">
        デザイン相談をする
      </a>
    </div>
  </div>
);
