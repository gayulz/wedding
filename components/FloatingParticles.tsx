import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingParticles: React.FC = () => {
  // 반딧불 같은 파티클 생성 (40개)
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      // 크기에 따른 레이어 분류 (원근감)
      const layer = Math.random(); // 0-1 (0: 멀리, 1: 가까이)
      const size = layer < 0.3 ? Math.random() * 3 + 2 : // 멀리: 2-5px
        layer < 0.7 ? Math.random() * 5 + 4 : // 중간: 4-9px
          Math.random() * 8 + 6; // 가까이: 6-14px

      return {
        id: i,
        x: Math.random() * 100, // 0-100% 범위
        size,
        layer,
        delay: Math.random() * 8, // 0-8초 지연
        duration: layer < 0.3 ? Math.random() * 20 + 25 : // 멀리: 느리게
          layer < 0.7 ? Math.random() * 15 + 18 : // 중간
            Math.random() * 12 + 12, // 가까이: 빠르게
        baseOpacity: layer < 0.3 ? 0.3 : layer < 0.7 ? 0.5 : 0.7,
        glowIntensity: Math.random() * 0.5 + 0.5, // 0.5-1
        blinkSpeed: Math.random() * 3 + 2, // 2-5초 깜빡임
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 220, 0.95) 0%, 
              rgba(255, 248, 180, 0.8) 20%, 
              rgba(255, 230, 120, 0.6) 40%, 
              rgba(200, 180, 80, 0.3) 60%, 
              transparent 80%)`,
            boxShadow: `
              0 0 ${particle.size * 0.5}px rgba(255, 250, 200, ${particle.glowIntensity * 0.8}),
              0 0 ${particle.size * 1.5}px rgba(255, 240, 150, ${particle.glowIntensity * 0.5}),
              0 0 ${particle.size * 3}px rgba(255, 220, 100, ${particle.glowIntensity * 0.3}),
              0 0 ${particle.size * 5}px rgba(200, 170, 50, ${particle.glowIntensity * 0.15})
            `,
            filter: particle.layer < 0.3 ? 'blur(1px)' : 'none',
          }}
          initial={{
            y: '110vh',
            x: 0,
            scale: 0.3,
            opacity: 0
          }}
          animate={{
            y: '-10vh',
            x: [0, Math.random() * 60 - 30, Math.random() * 40 - 20, 0], // 불규칙한 좌우 흔들림
            scale: [0.3, 1, 0.8, 1.1, 0.9, 1],
            opacity: [
              0,
              particle.baseOpacity,
              particle.baseOpacity * 0.4, // 깜빡임
              particle.baseOpacity * 0.9,
              particle.baseOpacity * 0.3, // 깜빡임
              particle.baseOpacity * 0.8,
              particle.baseOpacity * 0.5, // 깜빡임
              particle.baseOpacity,
              0
            ],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
            x: {
              duration: particle.duration * 0.6,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            },
            scale: {
              duration: particle.blinkSpeed,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            },
            opacity: {
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;

