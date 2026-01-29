import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * [NEW] 개나리꽃잎이 화면 하단에서 부채꼴로 흩날리는 파티클 효과
 * 입체감 적용: 가까운 꽃잎은 크고 선명, 먼 꽃잎은 작고 흐릿
 * 생성 위치: 화면 아래 하단 + 오른쪽 하단
 * 
 * @author gayul.kim
 * @since 2026-01-29
 */
const ForsythiaParticles: React.FC = () => {
    // 꽃잎 파티클 생성 (24개 - 20% 증가)
    const petals = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => {
            // 거리(깊이) - 0: 가장 멀리, 1: 가장 가까이
            const depth = Math.random();

            // 생성 위치 결정: 절반은 아래 하단, 절반은 오른쪽 하단
            let startX: number;
            let startY: number;
            let angle: number;

            if (i % 2 === 0) {
                // 화면 아래 하단 (가로로 넓게)
                startX = 20 + Math.random() * 60; // 20% ~ 80%
                startY = 90 + Math.random() * 10; // 90% ~ 100%
                // 위쪽으로 퍼지기 (부채꼴)
                angle = 240 + Math.random() * 60; // 240도 ~ 300도 (위쪽 방향)
            } else {
                // 오른쪽 하단 모서리
                startX = 85 + Math.random() * 15; // 85% ~ 100%
                startY = 75 + Math.random() * 25; // 75% ~ 100%
                // 왼쪽 위로 퍼지기 (부채꼴)
                angle = 190 + Math.random() * 80; // 190도 ~ 270도 (왼쪽 위 방향)
            }

            // 더 넓게 퍼지도록 거리 증가
            const distance = 100 + Math.random() * 80; // 100 ~ 180 (기존 80~140에서 증가)

            const endX = startX + Math.cos(angle * Math.PI / 180) * distance;
            const endY = startY + Math.sin(angle * Math.PI / 180) * distance;

            // 깊이에 따른 크기 (가까울수록 큼)
            const baseSize = 6 + depth * 14; // 6px ~ 20px

            // 깊이에 따른 블러 (멀수록 흐릿)
            const blur = (1 - depth) * 2; // 0px ~ 2px

            // 깊이에 따른 속도 (가까울수록 빠름)
            const duration = 12 - depth * 5; // 7초 ~ 12초

            // 깊이에 따른 투명도 (멀수록 더 투명)
            const opacity = 0.3 + depth * 0.4; // 0.3 ~ 0.7

            return {
                id: i,
                depth,
                startX,
                startY,
                endX,
                endY,
                size: baseSize,
                blur,
                opacity,
                rotation: Math.random() * 360, // 초기 회전
                rotationEnd: (Math.random() - 0.5) * 720, // 회전량
                duration,
                delay: Math.random() * 6, // 0~6초 딜레이 (더 분산)
            };
        }).sort((a, b) => a.depth - b.depth); // 멀리 있는 것부터 렌더링 (z-order)
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
            style={{ opacity: 0.5 }} // 전체 투명도 50%
        >
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    className="absolute"
                    initial={{
                        left: `${petal.startX}%`,
                        top: `${petal.startY}%`,
                        rotate: petal.rotation,
                        scale: 0,
                    }}
                    animate={{
                        left: [`${petal.startX}%`, `${petal.endX}%`],
                        top: [`${petal.startY}%`, `${petal.endY}%`],
                        rotate: [petal.rotation, petal.rotation + petal.rotationEnd],
                        scale: [0, 1, 1, 0.8, 0],
                    }}
                    transition={{
                        duration: petal.duration,
                        delay: petal.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        width: petal.size,
                        height: petal.size * 0.7, // 타원형 꽃잎
                        filter: petal.blur > 0 ? `blur(${petal.blur}px)` : 'none',
                        opacity: petal.opacity,
                        zIndex: Math.floor(petal.depth * 10), // 깊이에 따른 z-index
                    }}
                >
                    {/* 개나리 꽃잎 모양 - 연노란색 */}
                    <svg
                        viewBox="0 0 20 14"
                        className="w-full h-full"
                        style={{
                            filter: `drop-shadow(0 ${1 + petal.depth}px ${2 + petal.depth * 2}px rgba(255, 215, 0, ${0.2 + petal.depth * 0.2}))`,
                        }}
                    >
                        {/* 꽃잎 형태 - 부드러운 타원형 */}
                        <ellipse
                            cx="10"
                            cy="7"
                            rx="9"
                            ry="6"
                            fill={`url(#forsythiaGradient-${petal.id})`}
                        />
                        {/* 꽃잎 중심 라인 */}
                        <path
                            d="M2 7 Q10 5 18 7"
                            stroke="rgba(255, 200, 50, 0.4)"
                            strokeWidth="0.5"
                            fill="none"
                        />
                        <defs>
                            <linearGradient id={`forsythiaGradient-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFF59D" /> {/* 연한 노랑 */}
                                <stop offset="50%" stopColor="#FFEE58" /> {/* 개나리 노랑 */}
                                <stop offset="100%" stopColor="#FFD54F" /> {/* 진한 노랑 */}
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

export default ForsythiaParticles;
