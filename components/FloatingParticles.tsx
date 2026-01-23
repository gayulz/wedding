import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TouchParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  createdAt: number;
}

const FloatingParticles: React.FC = () => {
  const [touchParticles, setTouchParticles] = useState<TouchParticle[]>([]);

  // 반딧불 같은 파티클 생성 (60개)
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
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
        delay: Math.random() * 5, // 0-5초 지연 (속도 증가)
        duration: layer < 0.3 ? Math.random() * 12 + 15 : // 멀리: 15-27초 (속도 증가)
          layer < 0.7 ? Math.random() * 10 + 10 : // 중간: 10-20초
            Math.random() * 8 + 8, // 가까이: 8-16초 (더 빠르게)
        baseOpacity: layer < 0.3 ? 0.3 : layer < 0.7 ? 0.5 : 0.7,
        glowIntensity: Math.random() * 0.5 + 0.5, // 0.5-1
        blinkSpeed: Math.random() * 2 + 1.5, // 1.5-3.5초 깜빡임 (더 빠르게)
      };
    });
  }, []);

  // 터치/클릭 시 파티클 생성
  const createTouchParticles = useCallback((clientX: number, clientY: number) => {
    const count = Math.floor(Math.random() * 3) + 1; // 1-3개 생성 (절반으로 축소)
    const newParticles: TouchParticle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: clientX + (Math.random() * 40 - 20), // 약간 퍼지게
        y: clientY + (Math.random() * 40 - 20),
        size: Math.random() * 8 + 6,
        createdAt: Date.now(),
      });
    }

    setTouchParticles(prev => [...prev, ...newParticles]);
  }, []);

  // 오래된 터치 파티클 제거 (2초 후)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTouchParticles(prev => prev.filter(p => now - p.createdAt < 2000));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 이벤트 핸들러
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      createTouchParticles(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        createTouchParticles(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) { // 드래그 중
        if (Math.random() > 0.7) { // 30% 확률로 생성 (너무 많이 생성 방지)
          createTouchParticles(e.clientX, e.clientY);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0] && Math.random() > 0.8) { // 20% 확률
        createTouchParticles(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [createTouchParticles]);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* 기본 떠다니는 파티클 */}
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
            x: [0, Math.random() * 60 - 30, Math.random() * 40 - 20, 0],
            scale: [0.3, 1, 0.8, 1.1, 0.9, 1],
            opacity: [
              0,
              particle.baseOpacity,
              particle.baseOpacity * 0.4,
              particle.baseOpacity * 0.9,
              particle.baseOpacity * 0.3,
              particle.baseOpacity * 0.8,
              particle.baseOpacity * 0.5,
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

      {/* 터치/클릭으로 생성된 파티클 */}
      <AnimatePresence>
        {touchParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 230, 1) 0%, 
                rgba(255, 250, 200, 0.9) 20%, 
                rgba(255, 240, 150, 0.7) 40%, 
                rgba(220, 200, 100, 0.4) 60%, 
                transparent 80%)`,
              boxShadow: `
                0 0 ${particle.size}px rgba(255, 255, 220, 0.9),
                0 0 ${particle.size * 2}px rgba(255, 240, 150, 0.6),
                0 0 ${particle.size * 4}px rgba(255, 220, 100, 0.4)
              `,
            }}
            initial={{
              scale: 0,
              opacity: 1,
              x: -particle.size / 2,
              y: -particle.size / 2,
            }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [1, 0.8, 0],
              y: [0, -80 - Math.random() * 60],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingParticles;
