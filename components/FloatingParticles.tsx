import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingParticles: React.FC = () => {
  // 파티클 생성 (30개)
  const particles = useMemo(() => {
    const colors = [
      'from-yellow-200 to-amber-100',
      'from-amber-200 to-yellow-100',
      'from-yellow-100 to-amber-50',
      'from-amber-100 to-yellow-50',
    ];

    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // 0-100% 범위
      size: Math.random() * 8 + 3, // 3-11px (더 크게)
      delay: Math.random() * 5, // 0-5초 지연
      duration: Math.random() * 10 + 15, // 15-25초 애니메이션
      opacity: Math.random() * 0.4 + 0.4, // 0.4-0.8 투명도 (연노란색이라 조금 더 투명하게)
      color: colors[Math.floor(Math.random() * colors.length)],
      blur: Math.random() * 2 + 1, // 1-3px 블러
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full bg-gradient-to-br ${particle.color}`}
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.blur * 4}px rgba(251, 191, 36, 0.5), 0 0 ${particle.blur * 8}px rgba(251, 191, 36, 0.25)`,
            filter: `blur(${particle.blur * 0.3}px)`,
          }}
          initial={{ y: '100vh', x: 0, scale: 0.5 }}
          animate={{
            y: '-100vh',
            x: [0, Math.random() * 100 - 50, 0], // 좌우로 흔들림
            scale: [0.5, 1.2, 0.8, 1],
            opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.7, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
            x: {
              duration: particle.duration / 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
            scale: {
              duration: particle.duration / 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
            opacity: {
              duration: particle.duration / 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
