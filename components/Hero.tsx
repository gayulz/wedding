
import React from 'react';
import { motion } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';
import { useWeddingData } from '@/hooks/useWeddingData';

interface HeroProps {
  startAnimation: boolean;
}

const Hero: React.FC<HeroProps> = ({ startAnimation }) => {
  const { weddingData } = useWeddingData();

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
          backgroundPosition: 'center',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={startAnimation ? "visible" : "hidden"}
        className="relative z-10 p-4 md:p-6 w-full max-w-md text-center drop-shadow-2xl"
      >
        {/* 1. WEDDING INVITATION (Left -> Right) */}
        <motion.p
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeOut", delay: 0 }
            }
          }}
          className="text-white/70 tracking-[0.4em] uppercase text-[10px] mb-4 font-joseon"
        >
          {weddingData.hero.label}
        </motion.p>

        {/* 2. Names (Right -> Left) */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
            }
          }}
          className="text-4xl md:text-5xl text-white font-myeongjo mb-8 leading-tight text-glow-subtle tracking-tight"
        >
          {weddingData.hero.title.groom} <span className="text-xl align-middle mx-1 opacity-80">{weddingData.hero.title.connector}</span> {weddingData.hero.title.bride}
        </motion.h1>

        {/* 3. Date (Left -> Right) */}
        <motion.p
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeOut", delay: 0.6 }
            }
          }}
          className="text-white font-myeongjo text-lg md:text-xl tracking-widest mb-3"
        >
          {weddingData.common.date.full}
        </motion.p>

        {/* 4. Location (Right -> Left) */}
        <motion.p
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeOut", delay: 0.9 }
            }
          }}
          className="text-white/80 mt-1 text-sm md:text-base font-gowoon"
        >
          {weddingData.common.location.name}, {weddingData.common.location.hall}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Hero;
