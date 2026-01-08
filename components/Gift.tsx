
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AccountAccordion: React.FC<{ 
  title: string; 
  accounts: { name: string; bank: string; num: string }[]; 
  isOpen: boolean; 
  onToggle: () => void;
}> = ({ title, accounts, isOpen, onToggle }) => {
  return (
    <div className="w-full overflow-hidden border border-gray-100 rounded-2xl bg-white mb-3">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-gray-700 font-medium bg-gray-50/50"
      >
        <span>{title}</span>
        <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="px-5 pb-5 divide-y divide-gray-50"
          >
            {accounts.map((acc, i) => (
              <div key={i} className="py-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">{acc.bank}</span>
                  <span className="text-gray-900 font-medium">{acc.name}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-800 font-mono text-sm">{acc.num}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(acc.num);
                      alert('복사되었습니다.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-[10px] text-gray-500 hover:bg-yellow-100 transition-colors"
                  >
                    복사하기
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Gift: React.FC = () => {
  // 'groom', 'bride', null 중 하나의 값만 가짐
  const [openAccordion, setOpenAccordion] = useState<'groom' | 'bride' | null>(null);

  const handleToggle = (type: 'groom' | 'bride') => {
    // 같은 것을 클릭하면 닫고, 다른 것을 클릭하면 열기
    setOpenAccordion(openAccordion === type ? null : type);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fdfaf7] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-myeongjo text-gray-800 tracking-[0.2em]">HEART GIFT</h2>
        <div className="text-[10px] text-gray-400 mt-2">축하의 마음을 전하세요</div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants}>
          <AccountAccordion
            title="신랑측 마음 전하실 곳"
            accounts={[
                { bank: '우리은행', name: '석명순', num: '70820187102001' },
                { bank: '기업은행', name: '최봉석', num: '01044041519' }
            ]}
            isOpen={openAccordion === 'groom'}
            onToggle={() => handleToggle('groom')}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AccountAccordion
            title="신부측 마음 전하실 곳"
            accounts={[
              { bank: '기업은행', name: '김가율', num: '01087901519' },
            ]}
            isOpen={openAccordion === 'bride'}
            onToggle={() => handleToggle('bride')}
          />
        </motion.div>

        {/* 연락처 섹션 */}
        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 gap-4">
          {/* 신랑측 */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white">
            <h3 className="text-center text-sm font-medium text-gray-700 mb-4">신랑측</h3>
            <div className="space-y-2">
              <a
                href="tel:010-4404-1519"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-yellow-100 transition-colors"
              >
                <i className="fa-solid fa-phone text-gray-600 text-sm"></i>
                <span className="text-sm text-gray-700">신랑</span>
              </a>
              <a
                href="tel:010-5232-9720"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-yellow-100 transition-colors"
              >
                <i className="fa-solid fa-phone text-gray-600 text-sm"></i>
                <span className="text-sm text-gray-700">어머니</span>
              </a>
            </div>
          </div>

          {/* 신부측 */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white">
            <h3 className="text-center text-sm font-medium text-gray-700 mb-4">신부측</h3>
            <div className="space-y-2">
              <a
                href="tel:010-8790-1519"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-yellow-100 transition-colors"
              >
                <i className="fa-solid fa-phone text-gray-600 text-sm"></i>
                <span className="text-sm text-gray-700">신부</span>
              </a>
              <a
                href="tel:010-6600-4422"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-yellow-100 transition-colors"
              >
                <i className="fa-solid fa-phone text-gray-600 text-sm"></i>
                <span className="text-sm text-gray-700">아버지</span>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 text-xs text-gray-400 text-center leading-relaxed"
      >
        화훼 화환은 정중히 사양합니다.<br/>
        보내주시는 따뜻한 마음 감사히 받겠습니다.
      </motion.p>
    </div>
  );
};

export default Gift;
