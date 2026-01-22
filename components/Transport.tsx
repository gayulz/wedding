
import React from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import wedding81 from '../images/wedding-81.webp';

const Transport: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <div className="relative h-full w-full flex flex-col items-center overflow-y-auto">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${wedding81})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-white/70" />
      </div>

      {/* 상단 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center pt-12 pb-6 px-16"
      >
        <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-0">TRANSPORT</p>
        <h2 className="text-2xl font-myeongjo text-gray-800 mt-0 mb-2">오시는 길</h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-md space-y-8 px-8 pb-8"
      >
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <i className="fa-solid fa-bus"></i>
            </div>
            <h3 className="font-bold text-gray-800">대중교통 안내</h3>
          </div>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed pl-11">
            <div>
              <p className="font-semibold text-gray-800 mb-1">시내버스</p>
              <p>지선(초록) : 187, 187-1, 188</p>
              <p>간선(파랑) : 180, 881, 881-1, 883, 883-1, 884, 884-1, 884-2, 885, 885</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">기차 KTX</p>
              <p>동대구역 → 구미역 → 대중교통 이용</p>
              <p>(30분~50분 소요)</p>
            </div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
              <i className="fa-solid fa-car"></i>
            </div>
            <h3 className="font-bold text-gray-800">자가용 및 주차</h3>
          </div>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed pl-11">
            <div>
              <p className="font-semibold text-gray-800 mb-1">주차 안내</p>
              <p>실외 1주차장과 실내 2주차장이 홀과 가장 가깝습니다.</p>
              <p>최대 1,400대 주차 가능</p>
              <p>웨딩홀 방문객 무료 주차</p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Transport;
