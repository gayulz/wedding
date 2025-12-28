
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';

const ASPECT_RATIOS = [
  '1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'
];

// Map unsupported UI aspect ratios to SDK supported ones for the actual call
const mapToSupportedRatio = (ratio: string) => {
  if (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(ratio)) return ratio;
  if (ratio === '2:3') return '3:4';
  if (ratio === '3:2') return '4:3';
  if (ratio === '21:9') return '16:9';
  return '1:1';
};

const AiPhoto: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('이미지 설명을 입력해주세요.');
      return;
    }

    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Proceeding as instructed: assume success after triggering openSelectKey
      }

      setIsGenerating(true);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `${prompt} in a soft, elegant wedding style` }],
        },
        config: {
          imageConfig: {
            aspectRatio: mapToSupportedRatio(aspectRatio),
            imageSize: '1K'
          }
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error('이미지를 생성하지 못했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Requested entity was not found')) {
        // @ts-ignore
        window.aistudio.openSelectKey();
      }
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fefefe] p-6 overflow-y-auto">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-myeongjo text-gray-800 tracking-[0.2em]">AI WEDDING PHOTO</h2>
          <p className="text-[10px] text-gray-400 mt-2">AI와 함께 우리만의 웨딩 화보를 만들어보세요</p>
        </div>

        <div className="liquid-glass p-6 space-y-4 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium ml-1">상상하는 모습을 적어주세요</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 벚꽃이 흩날리는 정원에서 서로를 바라보는 연인"
              className="w-full h-24 bg-white/50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium ml-1">비율 선택</label>
            <div className="grid grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 text-[10px] rounded-lg transition-all border ${
                    aspectRatio === ratio
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                      : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-sm tracking-[0.2em] transition-all shadow-lg ${
              isGenerating
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-black active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-notch animate-spin"></i>
                생성 중...
              </span>
            ) : '이미지 생성하기'}
          </button>
        </div>

        <AnimatePresence>
          {generatedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-100 to-blue-100 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-auto rounded-xl object-contain max-h-[40vh]"
                />
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-4 italic">
                * AI가 생성한 이미지는 참고용으로만 사용해주세요
              </p>
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-red-400 font-light"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="text-center pt-4">
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-gray-300 hover:text-gray-500 underline underline-offset-2"
          >
            Billing Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default AiPhoto;
