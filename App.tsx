import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Intro from './components/Intro';
import MainContent from './components/MainContent';
import OpeningSequence from './components/OpeningSequence';
import ShareButton from './components/ShareButton';
import FloatingParticles from './components/FloatingParticles';

const SECTIONS = ['hero', 'main'];

const App: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0); // 0 or 1
  const [isScrolling, setIsScrolling] = useState(false);
  const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
  const [showOpening, setShowOpening] = useState(true);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  const touchStartY = useRef(0);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // 카카오톡 웹뷰에서 외부 브라우저로 열기
  const openInExternalBrowser = () => {
    const currentUrl = window.location.href;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isAndroid) {
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end;`;
    } else if (isIOS) {
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    }
  };

  const handleScroll = useCallback((delta: number) => {
    if (isScrolling || isAnyModalOpen || showOpening) return;

    if (currentIdx === 1) {
      // Logic for MainContent (index 1)
      if (mainContentRef.current) {
        if (mainContentRef.current.scrollTop <= 0 && delta < 0) {
          // Top of MainContent and scrolling UP -> Go to Hero
          setIsScrolling(true);
          setCurrentIdx(0);
          setTimeout(() => setIsScrolling(false), 800);
        }
        // Otherwise let native scroll happen
      }
      return;
    }

    if (delta > 0 && currentIdx < SECTIONS.length - 1) {
      setIsScrolling(true);
      setCurrentIdx(prev => prev + 1);
      setTimeout(() => setIsScrolling(false), 800);
    } else if (delta < 0 && currentIdx > 0) {
      setIsScrolling(true);
      setCurrentIdx(prev => prev - 1);
      setTimeout(() => setIsScrolling(false), 800);
    }
  }, [isScrolling, currentIdx, isAnyModalOpen, showOpening]);

  // 카카오톡 웹뷰 감지 및 팝업 표시
  useEffect(() => {
    const isKakaoTalk = /KAKAOTALK/.test(navigator.userAgent);
    if (isKakaoTalk) {
      setShowBrowserPrompt(true);
    }
  }, []);

  // 주소창과 하단 바 자동 숨김 (모바일 브라우저)
  useEffect(() => {
    const hideAddressBar = () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 100);

      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 300);
    };

    hideAddressBar();
    window.addEventListener('orientationchange', hideAddressBar);

    return () => {
      window.removeEventListener('orientationchange', hideAddressBar);
    };
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Only hijack wheel if NOT in MainContent or if at top of MainContent going up
      if (currentIdx !== 1) {
        handleScroll(e.deltaY);
      } else {
        if (mainContentRef.current && mainContentRef.current.scrollTop <= 0 && e.deltaY < 0) {
          handleScroll(e.deltaY);
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY.current - touchEndY;
      if (Math.abs(delta) > 50) {
        // Only hijack touch if NOT in MainContent or if at top of MainContent going up
        if (currentIdx !== 1) {
          handleScroll(delta);
        } else {
          if (mainContentRef.current && mainContentRef.current.scrollTop <= 0 && delta < 0) {
            handleScroll(delta);
          }
        }
      }
    };

    window.addEventListener('wheel', onWheel);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleScroll, currentIdx]);

  return (
    <div className="fixed inset-0 bg-gray-100 flex justify-center items-center overflow-hidden">
      <div className="relative w-full h-full max-w-[430px] md:max-w-[550px] bg-[#f8f8f8] shadow-2xl overflow-hidden select-none">
        {showOpening && <OpeningSequence onComplete={() => setShowOpening(false)} />}
        <FloatingParticles />

        {showBrowserPrompt && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 max-w-sm mx-4 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">더 나은 경험을 위해</h3>
                <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                  카카오톡 브라우저보다 외부 브라우저에서<br />더 빠르고 부드럽게 감상할 수 있습니다.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBrowserPrompt(false)}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95"
                  >
                    계속 보기
                  </button>
                  <button
                    onClick={openInExternalBrowser}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg transition-all active:scale-95"
                  >
                    브라우저 열기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={SECTIONS[currentIdx]}
            initial={{ opacity: 0, y: currentIdx === 1 ? 20 : 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="h-full w-full will-change-transform transform-gpu"
          >
            {currentIdx === 0 && <Hero />}
            {currentIdx === 1 && (
              <MainContent
                ref={mainContentRef}
                onModalStateChange={setIsAnyModalOpen}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {currentIdx >= 1 && <ShareButton />}
      </div>
    </div>
  );
};

export default App;
