import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingNavMenuProps {
  currentSection: number;
  onNavigate: (index: number) => void;
}

const FloatingNavMenu: React.FC<FloatingNavMenuProps> = ({ currentSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: '첫 화면', index: 0 },
    { label: '인사말', index: 1 },
    { label: '인터뷰', index: 2 },
    { label: '갤러리', index: 3 },
    { label: '위치', index: 4 },
    { label: '대중 교통', index: 5 },
    { label: '마음 전하실 곳', index: 6 },
    { label: '방명록', index: 7 },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-stretch gap-2"
          >
            {menuItems.map((item, idx) => (
              <motion.button
                key={`${item.label}-${item.index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => {
                  onNavigate(item.index);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  currentSection === item.index
                    ? 'bg-yellow-200 text-gray-900 shadow-lg'
                    : 'bg-yellow-100/90 text-gray-900 hover:bg-yellow-200'
                }`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all bg-yellow-100/90 text-[#3c1e1e] hover:bg-yellow-200 active:scale-95"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <motion.i
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="fa-solid fa-chevron-up text-xl"
        ></motion.i>
      </button>
    </div>
  );
};

export default FloatingNavMenu;
