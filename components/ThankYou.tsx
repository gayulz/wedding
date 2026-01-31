import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Guestbook from './Guestbook';
import { weddingData } from '@/data/content';
import { loadImage } from '@/lib/image-loader';

/**
 * [NEW] ThankYou - 결혼식 이후 감사 페이지
 *
 * 2026-03-14 14:00 이후 표시되는 페이지
 * - 감사 메시지 표시
 * - 결혼 후 경과일 계산 (D+n)
 * - 기존 방명록 임베드
 *
 * @author gayul.kim
 * @since 2026-01-31
 */

interface ThankYouProps {
	onModalStateChange: (isOpen: boolean) => void;
}

const ThankYou: React.FC<ThankYouProps> = ({ onModalStateChange }) => {
	const [daysSinceFirstMeet, setDaysSinceFirstMeet] = useState(0);
	const [daysSinceWedding, setDaysSinceWedding] = useState(0);

	// 첫 만남 날짜: 2020-03-31
	const firstMeetDate = new Date('2020-03-31T00:00:00');
	// 결혼식 날짜: 2026-03-14 14:00
	const weddingDate = new Date('2026-03-14T14:00:00');

	useEffect(() => {
		const calculateDays = () => {
			const now = new Date();

			// 첫 만남 이후 경과일 (절댓값)
			const diffTimeFirstMeet = now.getTime() - firstMeetDate.getTime();
			const diffDaysFirstMeet = Math.abs(Math.floor(diffTimeFirstMeet / (1000 * 60 * 60 * 24)));
			setDaysSinceFirstMeet(diffDaysFirstMeet);

			// 결혼 이후 경과일 (절댓값)
			const diffTimeWedding = now.getTime() - weddingDate.getTime();
			const diffDaysWedding = Math.abs(Math.floor(diffTimeWedding / (1000 * 60 * 60 * 24)));
			setDaysSinceWedding(diffDaysWedding);
		};

		calculateDays();
		// 매일 자정에 업데이트
		const interval = setInterval(calculateDays, 1000 * 60 * 60 * 24);

		return () => clearInterval(interval);
	}, []);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.25,
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
				duration: 0.6,
				ease: "easeOut"
			}
		}
	};

	return (
		<div className="relative h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar bg-white">
			{/* Hero 섹션 - 감사 메시지 */}
			<div className="relative min-h-screen w-full flex items-end justify-center pb-16 md:pb-20 pt-12">
				{/* Background Image */}
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
					<div className="absolute inset-0 bg-black/50" />
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="relative z-10 p-8 w-full max-w-md text-center drop-shadow-2xl"
				>
					{/* 라벨 */}
					<motion.p
						variants={itemVariants}
						className="text-white/70 tracking-[0.4em] uppercase text-[10px] mb-4 font-joseon"
					>
						Thank You
					</motion.p>

					{/* 메인 타이틀 */}
					<motion.h1
						variants={itemVariants}
						className="text-3xl md:text-4xl text-white font-myeongjo mb-6 leading-tight text-glow-subtle"
					>
						방문해 주셔서
						<br />
						감사합니다
					</motion.h1>

					{/* 디데이 표시 */}
					<motion.div
						variants={itemVariants}
						className="inline-block mb-8 px-8 py-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20"
					>
						<p className="text-white font-gowoon text-sm md:text-base leading-relaxed">
							연인으로 시작한 지 <span className="font-bold font-nanumsquare text-lg md:text-xl mx-1">{daysSinceFirstMeet}</span>일째
						</p>
						<p className="text-white font-gowoon text-sm md:text-base leading-relaxed mt-2">
							인생을 함께하기 시작한 지 <span className="font-bold font-nanumsquare text-lg md:text-xl mx-1">{daysSinceWedding}</span>일째
						</p>
					</motion.div>

					{/* 부부 이름 */}
					<motion.h2
						variants={itemVariants}
						className="text-2xl md:text-3xl text-white font-myeongjo mb-8 leading-tight tracking-tight"
					>
						{weddingData.common.groom.firstName} <span className="text-lg align-middle mx-1 opacity-80">💍</span> {weddingData.common.bride.firstName}
					</motion.h2>

					{/* 감사 메시지 */}
					<motion.p
						variants={itemVariants}
						className="text-white/90 font-gowoon text-sm md:text-base leading-relaxed whitespace-pre-line"
					>
						{`함께해 주신 모든 분들께 진심으로 감사드립니다.
받은 사랑 잊지 않고 행복하게 잘 살겠습니다.`}
					</motion.p>
				</motion.div>
			</div>

			{/* 방명록 섹션 */}
			<div className="relative w-full">
				<Guestbook onModalStateChange={onModalStateChange} />
			</div>
		</div>
	);
};

export default ThankYou;
