
import React from 'react';
import { motion } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';
import { weddingData } from '@/data/content';

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
          className="text-white/70 tracking-[0.4em] uppercase text-[10px] mb-4 font-joseon"
        >
          {weddingData.hero.label}
        </motion.p>
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-4xl md:text-5xl text-white font-myeongjo mb-8 leading-tight text-glow-subtle tracking-tight"
        >
          {weddingData.hero.title.groom} <span className="text-xl align-middle mx-1 opacity-80">{weddingData.hero.title.connector}</span> {weddingData.hero.title.bride}
        </motion.h1>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-white font-myeongjo text-lg md:text-xl tracking-widest mb-3"
        >
          {weddingData.common.date.full}
        </motion.p>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-white/80 mt-1 text-sm md:text-base font-gowoon"
        >
          {weddingData.common.location.name}, {weddingData.common.location.hall}
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
