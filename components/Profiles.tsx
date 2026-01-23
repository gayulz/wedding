import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalBackHandler } from '@/hooks/useModalBackHandler';
import { loadImage } from '@/lib/image-loader.ts';
import { weddingData } from '@/data/content';

interface ProfilesProps {
	onModalStateChange: (isOpen: boolean) => void;
}

const Profiles: React.FC<ProfilesProps> = ({ onModalStateChange }) => {
	const [isInterviewOpen, setIsInterviewOpen] = useState(false);

	useModalBackHandler(isInterviewOpen, () => setIsInterviewOpen(false));

	// [MIG] 모달 상태 변경 시 App.tsx에 알림 및 스크롤 잠금 처리
	useEffect(() => {
		onModalStateChange(isInterviewOpen);

		if (isInterviewOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isInterviewOpen, onModalStateChange]);

	// 모달에서 스크롤 이벤트가 부모로 전파되지 않도록 차단
	const handleModalWheel = (e: React.WheelEvent) => {
		e.stopPropagation();
	};

	const handleModalTouch = (e: React.TouchEvent) => {
		e.stopPropagation();
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1
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

	// 인터뷰 내용
	const { interviews } = weddingData.profiles;

	return (
		<div className="h-full w-full flex flex-col items-center bg-[#f8f8f8] overflow-hidden px-6 pb-12">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				className="flex flex-col items-center w-full max-w-md space-y-8"
			>
				{/* 헤더 */}
				<motion.div variants={itemVariants} className="text-center pt-8 pb-10">
					<p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">{weddingData.profiles.label}</p>
					<h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">{weddingData.profiles.title}</h2>
					<div className="w-8 h-[1px] bg-gray-200 mx-auto mb-6"></div>
					<p className="text-sm font-gowoon text-gray-500 whitespace-pre-line">{weddingData.profiles.subtitle}</p>
				</motion.div>

				{/* 사진 */}
				<motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 w-full px-4">
					<div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group">
						<motion.img
							whileHover={{ scale: 1.25 }}
							whileTap={{ scale: 1.25 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							src={loadImage('wedding-99')}
							alt="Groom"
							className="w-full h-64 object-cover"
						/>
					</div>
					<div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group">
						<motion.img
							whileHover={{ scale: 1.25 }}
							whileTap={{ scale: 1.25 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							src={loadImage('wedding-98')}
							alt="Bride"
							className="w-full h-64 object-cover"
						/>
					</div>
				</motion.div>

				{/* 인터뷰 읽어보기 버튼 */}
				<motion.button
					variants={itemVariants}
					onClick={(e) => {
						e.stopPropagation();
						setIsInterviewOpen(true);
					}}
					onTouchEnd={(e) => {
						e.stopPropagation();
					}}
					className="px-12 py-3 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 font-nanumsquare interactive"
				>
					<i className="fa-solid fa-envelope text-xs"></i>
					<span>{weddingData.profiles.button}</span>
				</motion.button>
			</motion.div>

			{/* 인터뷰 모달 */}
			<AnimatePresence>
				{isInterviewOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsInterviewOpen(false)}
						onWheel={handleModalWheel}
						onTouchMove={handleModalTouch}
						className="fixed inset-0 z-[100] flex items-center justify-center p-6"
						style={{
							background: 'rgba(0, 0, 0, 0.85)',
						}}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							onWheel={handleModalWheel}
							onTouchMove={handleModalTouch}
							className="bg-[#3a3a3a] rounded-2xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto relative scrollbar-hide"
						>
							{/* 닫기 버튼 */}
							<button
								onClick={() => setIsInterviewOpen(false)}
								className="sticky top-0 float-right text-white/60 hover:text-white text-2xl z-10 mb-4"
							>
								<i className="fa-solid fa-xmark"></i>
							</button>

							{/* 헤더 */}
							<div className="text-center mb-10 clear-both">
								<p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2 font-joseon">{weddingData.profiles.label}</p>
								<h3 className="text-2xl text-white font-myeongjo">{weddingData.profiles.title}</h3>
							</div>

							{/* 인터뷰 내용 */}
							<div className="space-y-12">
								{/* Q1 */}
								<div className="space-y-6">
									<h4 className="text-md text-yellow-100/90 font-gowoon leading-relaxed">{interviews[0].question}</h4>
									<div className="space-y-6 pl-2 border-l-2 border-white/10">
										<div className="space-y-2">
											<p className="text-[11px] text-gray-500 font-joseon uppercase tracking-wider">Groom</p>
											<p className="text-[13px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
												{interviews[0].groom}
											</p>
										</div>
										<div className="space-y-2">
											<p className="text-[11px] text-gray-500 font-joseon uppercase tracking-wider">Bride</p>
											<p className="text-[13px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
												{interviews[0].bride}
											</p>
										</div>
									</div>
								</div>

								{/* Q2 */}
								<div className="space-y-6">
									<h4 className="text-m text-yellow-100/90 font-gowoon leading-relaxed">{interviews[1].question}</h4>
									<div className="pl-2 border-l-2 border-white/10">
										<p className="text-[13px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
											{interviews[1].answer}
										</p>
									</div>
								</div>

								{/* Q3 */}
								<div className="space-y-6">
									<h4 className="text-m text-yellow-100/90 font-gowoon leading-relaxed">{interviews[2].question}</h4>
									<div className="space-y-6 pl-2 border-l-2 border-white/10">
										<div className="space-y-2">
											<p className="text-[11px] text-gray-500 font-joseon uppercase tracking-wider">Groom</p>
											<p className="text-[13px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
												{interviews[2].groom}
											</p>
										</div>
										<div className="space-y-2">
											<p className="text-[11px] text-gray-500 font-joseon uppercase tracking-wider">Bride</p>
											<p className="text-[13px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
												{interviews[2].bride}
											</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Profiles;
