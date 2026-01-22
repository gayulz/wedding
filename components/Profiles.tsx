import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';

interface ProfilesProps {
	onModalStateChange: (isOpen: boolean) => void;
}

const Profiles: React.FC<ProfilesProps> = ({ onModalStateChange }) => {
	const [isInterviewOpen, setIsInterviewOpen] = useState(false);

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
	const interviews = [
		{
			question: "Q1. 결혼을 앞둔 소감",
			groom: "드디어 장가갑니다😊\n" +
				"평생 옆에 있고 싶은 사람을 만났습니다.\n" +
				"앞으로 더 잘해줄게요.\n" +
				"저희 잘 살겠습니다!\n",
			bride: "2010년 3월에 시작한 만남이\n" +
				"26년 3월에 끝이 나네요\n" +
				"앞으로 더 잘하고 잘 살께요 , 지켜봐주세요❤️\n"
		},
		{
			question: "Q2. 결혼을 결심한 계기는?",
			answer: "6년 사귀면서 싸워도 결국 다시 찾게 되더라고요.\n" +
				"이 정도면 그냥 평생 같이 살아야겠다 싶었습니다.\n" +
				"그리고 이 사람이랑 있으면 밥이 맛있어요🍚"
		},
		{
			question: "Q3. 서로에게 어떤 배우자가 될건가요?",
			groom: "설거지 잘하고, 무거운 거 잘 들고, 벌레 잡아주는 남편 되겠습니다💪",
			bride: "오빠 월급 안 건드리고 용돈 잘 주는 아내 될게요💰\n" +
				"(단, 내 월급도 안 건드려야 함)"

		}
	];

	return (
		<div className="h-full w-full flex flex-col items-center bg-[#f8f8f8] overflow-hidden pt-12 px-6 pb-12">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				className="flex flex-col items-center w-full max-w-md space-y-8"
			>
				{/* 헤더 */}
				<motion.div variants={itemVariants} className="text-center pt-8 pb-10">
					<p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">INTERVIEW</p>
					<h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">우리 두 사람의 이야기</h2>
					<div className="w-8 h-[1px] bg-gray-200 mx-auto mb-6"></div>
					<p className="text-sm font-gowoon text-gray-500">결혼을 앞두고 저희 두 사람의<br />인터뷰를 준비했습니다.</p>
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
					onClick={() => setIsInterviewOpen(true)}
					className="px-12 py-3 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 font-nanumsquare"
				>
					<i className="fa-solid fa-envelope text-xs"></i>
					<span>신랑 & 신부의 인터뷰 읽어보기</span>
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
						className="absolute inset-0 z-[100] flex items-center justify-center p-6"
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
								<p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2 font-joseon">INTERVIEW</p>
								<h3 className="text-2xl text-white font-myeongjo">우리 두 사람의 이야기</h3>
							</div>

							{/* 인터뷰 내용 */}
							<div className="space-y-12">
								{/* Q1 */}
								<div className="space-y-6">
									<h4 className="text-lg text-yellow-100/90 font-gowoon leading-relaxed">{interviews[0].question}</h4>
									<div className="space-y-6 pl-2 border-l-2 border-white/10">
										<div className="space-y-2">
											<p className="text-[11px] text-gray-500 font-joseon uppercase tracking-wider">Groom</p>
											<p className="text-[15px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
												{interviews[0].groom}
											</p>
										</div>
										<div className="space-y-2">
											<p className="text-[11px] text-gray-500 font-joseon uppercase tracking-wider">Bride</p>
											<p className="text-[15px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
												{interviews[0].bride}
											</p>
										</div>
									</div>
								</div>

								{/* Q2 */}
								<div className="space-y-6">
									<h4 className="text-lg text-yellow-100/90 font-gowoon leading-relaxed">{interviews[1].question}</h4>
									<div className="pl-2 border-l-2 border-white/10">
										<p className="text-[15px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
											{interviews[1].answer}
										</p>
									</div>
								</div>

								{/* Q3 */}
								<div className="space-y-6">
									<h4 className="text-lg text-yellow-100/90 font-gowoon leading-relaxed">{interviews[2].question}</h4>
									<div className="space-y-6 pl-2 border-l-2 border-white/10">
										<div className="space-y-2">
											<p className="text-[11px] text-gray-500 font-joseon uppercase tracking-wider">Groom</p>
											<p className="text-[15px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
												{interviews[2].groom}
											</p>
										</div>
										<div className="space-y-2">
											<p className="text-[11px] text-gray-500 font-joseon uppercase tracking-wider">Bride</p>
											<p className="text-[15px] text-white/90 leading-relaxed whitespace-pre-line font-nanumsquare">
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
