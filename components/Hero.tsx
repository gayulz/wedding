
import React from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import wedding37 from '../images/wedding-37.jpeg';

const Hero: React.FC = () => {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Background Image - wedding-37.jpeg */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${wedding37})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="relative z-10 p-8 glass-card w-4/5 max-w-md text-center rounded-3xl"
      >
        <p className="text-white/80 tracking-[0.3em] uppercase text-xs mb-4">Wedding Invitation</p>
        <h1 className="text-4xl md:text-5xl text-white font-myeongjo mb-8 leading-tight">
          최봉석 <span className="text-2xl align-middle mx-1"><br/>&<br/></span> 김가율
        </h1>
        <div className="w-8 h-[1px] bg-white/40 mx-auto mb-8" />
        <p className="text-white font-light text-lg tracking-widest">
          2026. 03. 14. 토
            <br/> PM 2:00
        </p>
        <p className="text-white/70 mt-2 text-sm">
          구미 토미스퀘어가든, 4층 스퀘어가든 홀
        </p>
      </motion.div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2 animate-pulse">Scroll Down</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </div>
  );
};

export default Hero;
