
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
import AiPhoto from './components/AiPhoto';

const SECTIONS = [
  'hero',
  'intro',
  'profiles',
  'gallery',
  'ai-photo',
  'location',
  'transport',
  'gift',
  'guestbook'
];

const App: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartY = useRef(0);

  const handleScroll = useCallback((delta: number) => {
    if (isScrolling) return;

    if (delta > 0 && currentIdx < SECTIONS.length - 1) {
      setIsScrolling(true);
      setCurrentIdx(prev => prev + 1);
    } else if (delta < 0 && currentIdx > 0) {
      setIsScrolling(true);
      setCurrentIdx(prev => prev - 1);
    }

    setTimeout(() => setIsScrolling(false), 800);
  }, [isScrolling, currentIdx]);

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
    <div className="h-screen w-screen relative bg-[#0a0a0c] overflow-hidden select-none">
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
          {currentIdx === 2 && <Profiles />}
          {currentIdx === 3 && <Gallery />}
          {currentIdx === 4 && <AiPhoto />}
          {currentIdx === 5 && <Location />}
          {currentIdx === 6 && <Transport />}
          {currentIdx === 7 && <Gift />}
          {currentIdx === 8 && <Guestbook />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {SECTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIdx === i ? 'bg-white scale-150 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <ShareButton />
    </div>
  );
};

export default App;
