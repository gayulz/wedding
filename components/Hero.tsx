
import React from 'react';
import { motion } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';

const Hero: React.FC = () => {
  return (
    <div className="relative h-full w-full flex items-end justify-center pb-32 md:pb-36">
      {/* Background Image - wedding-100.png */}
      {/* Background Image - wedding-100.png with Ken Burns Effect */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: `url(${loadImage('wedding-100')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.2,
              duration: 0.8
            }
          }
        }}
        className="relative z-10 p-4 md:p-6 w-full max-w-md text-center drop-shadow-2xl"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-white/80 tracking-[0.3em] uppercase text-[10px] mb-3"
        >
          Wedding Invitation
        </motion.p>
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-xl md:text-3xl text-white font-maruburi mb-6 leading-tight text-glow-subtle"
        >
          최봉석 <span className="text-sm align-middle mx-1">💍</span> 김가율
        </motion.h1>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-white font-light text-base md:text-[17px] tracking-widest"
        >
          2026. 03. 14. 토 PM 2:00
        </motion.p>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-white/70 mt-2 text-xs md:text-sm"
        >
          구미 토미스퀘어가든, 4층 스퀘어가든 홀
        </motion.p>
      </motion.div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2 animate-pulse">Scroll Down</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </div>
  );
};

export default Hero;
