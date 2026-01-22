
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Profiles from './components/Profiles';
import Location from './components/Location';
import Transport from './components/Transport';
import Gallery from './components/Gallery';
import Gift from './components/Gift';
import Guestbook from './components/Guestbook';
import ShareButton from './components/ShareButton';
import FloatingParticles from './components/FloatingParticles';
import FloatingNavMenu from './components/FloatingNavMenu';

const SECTIONS = [
  'hero',
  'intro',
  'profiles',
  'gallery',
  'location',
  'transport',
  'gift',
  'guestbook'
];

const App: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false); // [MIG] 모달 오픈 상태 관리
  const touchStartY = useRef(0);

  // 카카오톡 웹뷰에서 외부 브라우저로 열기
  const openInExternalBrowser = () => {
    const currentUrl = window.location.href;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isAndroid) {
      // Android: 크롬으로 열기
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end;`;
    } else if (isIOS) {
      // iOS: Safari로 열기 (iOS에서는 Safari가 기본)
      window.location.href = currentUrl;
    }
  };

  const handleScroll = useCallback((delta: number) => {
    if (isScrolling || isAnyModalOpen) return; // [MIG] 모달이 열려있을 때는 스크롤 방지

    if (delta > 0 && currentIdx < SECTIONS.length - 1) {
      setIsScrolling(true);
      setCurrentIdx(prev => prev + 1);
    } else if (delta < 0 && currentIdx > 0) {
      setIsScrolling(true);
      setCurrentIdx(prev => prev - 1);
    }

    setTimeout(() => setIsScrolling(false), 800);
  }, [isScrolling, currentIdx, isAnyModalOpen]); // [MIG] isAnyModalOpen 종속성 추가

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
      // 페이지 로드 후 약간의 스크롤을 트리거해서 주소창 숨김
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 100);

      // 추가로 안정성을 위해 한번 더
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 300);
    };

    hideAddressBar();

    // orientation 변경 시에도 다시 적용
    window.addEventListener('orientationchange', hideAddressBar);

    return () => {
      window.removeEventListener('orientationchange', hideAddressBar);
    };
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      handleScroll(e.deltaY);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY.current - touchEndY;
      if (Math.abs(delta) > 50) {
        handleScroll(delta);
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
  }, [handleScroll]);

  return (
    // [MIG] 데스크탑에서 모바일 뷰 시뮬레이션 (배경)
    <div className="fixed inset-0 bg-gray-100 flex justify-center items-center overflow-hidden">
      {/* [MIG] 실제 앱 컨텐츠 (모바일 규격 제한) */}
      <div className="relative w-full h-full max-w-[430px] bg-[#f8f8f8] shadow-2xl overflow-hidden select-none">
        {/* 떠다니는 파티클 효과 */}
        <FloatingParticles />

        {/* 카카오톡 브라우저 전환 안내 팝업 */}
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
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="h-full w-full"
          >
            {currentIdx === 0 && <Hero />}
            {currentIdx === 1 && <Intro />}
            {currentIdx === 2 && <Profiles onModalStateChange={setIsAnyModalOpen} />}
            {currentIdx === 3 && <Gallery onModalStateChange={setIsAnyModalOpen} />}
            {currentIdx === 4 && <Location />}
            {currentIdx === 5 && <Transport />}
            {currentIdx === 6 && <Gift />}
            {currentIdx === 7 && <Guestbook onModalStateChange={setIsAnyModalOpen} />}
          </motion.div>
        </AnimatePresence>

        <ShareButton />
        <FloatingNavMenu currentSection={currentIdx} onNavigate={setCurrentIdx} />
      </div>
    </div>
  );
};

export default App;
