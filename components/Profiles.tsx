import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import wedding98 from '../images/wedding-98.png';
import wedding99 from '../images/wedding-99.png';

const Profiles: React.FC = () => {
	const [isInterviewOpen, setIsInterviewOpen] = useState(false);

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
			groom: "드디어 장가갑니다😊 먼저 인생에서 가장 큰 결심을 할 수 있게 해준 예비 신부에게 너무 고맙습니다.\n\n가족이라는 단어를 함께 한다는 것은 정말 설레면서 아쉽다운 일이기에 그만큼 책임감을 갖고 살아야겠다고 다짐했습니다.\n\n저의 부부가 한걸음 한걸음을 성실하게 나가는 모습을 지켜봐주시고 응원해주세요💛💛",
			bride: "오래된 연인에서 이제는 서로의 부부가 되기로 약속 했습니다!\n\n아직은 남자친구라는 말이 더 익숙하지만 그동안 제 연봉을 준 신랑에게도 좋은 아내로서 더 좋게 배려하며 큰 힘이 되는 존재가 실천하니다😊\n\n이제는 저의 평생의 반려자가 될 신랑 에게도 좋은 아내로서 더 좋게"
		},
		{
			question: "Q2. 결혼을 결심한 계기는?",
			answer: "함께 라면 그 어떤 어려움이 있더라도 잘 해나갈 수 있다고 자신이 확신이 되었습니다.\n\n함께 서로를 보내면서 서로에 대한 믿음과 애정이 쌓이게 되고 이러한 행동들이 둘이 메에서\n\n서로에게 🙋🏻를 얻과, 👨🏻를 아빠가 될 수 있다는 확인이 들어 결혼을 결심하게 되었습니다😊"
		}
	];

	return (
		<div className="h-full w-full flex flex-col items-center justify-center bg-[#f8f8f8] overflow-hidden p-6">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				className="flex flex-col items-center w-full max-w-md space-y-8"
			>
				{/* 헤더 */}
				<motion.div variants={itemVariants} className="text-center">
					<p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2">INTERVIEW</p>
					<h2 className="text-2xl font-myeongjo text-gray-800">우리 두 사람의 이야기</h2>
					<p className="text-sm text-gray-600 mt-4">결혼을 앞두고 저희 두 사람의<br/>인터뷰를 준비했습니다.</p>
				</motion.div>

				{/* 사진 */}
				<motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 w-full px-4">
					<div className="relative rounded-2xl overflow-hidden shadow-lg">
						<img
							src={wedding99}
							alt="Groom"
							className="w-full h-64 object-cover"
						/>
					</div>
					<div className="relative rounded-2xl overflow-hidden shadow-lg">
						<img
							src={wedding98}
							alt="Bride"
							className="w-full h-64 object-cover"
						/>
					</div>
				</motion.div>

				{/* 인터뷰 읽어보기 버튼 */}
				<motion.button
					variants={itemVariants}
					onClick={() => setIsInterviewOpen(true)}
					className="px-12 py-3 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
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
							className="bg-[#3a3a3a] rounded-2xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto relative"
						>
							{/* 닫기 버튼 - sticky로 스크롤해도 항상 보임 */}
							<button
								onClick={() => setIsInterviewOpen(false)}
								className="sticky top-0 float-right text-white/60 hover:text-white text-2xl z-10 mb-4"
							>
								<i className="fa-solid fa-xmark"></i>
							</button>

							{/* 헤더 */}
							<div className="text-center mb-8 clear-both">
								<p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2">INTERVIEW</p>
								<h3 className="text-xl text-white font-myeongjo">우리 두 사람의 이야기</h3>
							</div>

							{/* 인터뷰 내용 */}
							<div className="space-y-8">
								{/* Q1 */}
								<div>
									<h4 className="text-base text-gray-300 font-medium mb-4">{interviews[0].question}</h4>
									<div className="space-y-4">
										<div>
											<p className="text-sm text-gray-400 mb-2">🤵 신랑 최봉석</p>
											<p className="text-sm text-white leading-relaxed whitespace-pre-line">
												{interviews[0].groom}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-400 mb-2">👰 신부 김가율</p>
											<p className="text-sm text-white leading-relaxed whitespace-pre-line">
												{interviews[0].bride}
											</p>
										</div>
									</div>
								</div>

								{/* 구분선 */}
								<div className="border-t border-gray-600"></div>

								{/* Q2 */}
								<div>
									<h4 className="text-base text-gray-300 font-medium mb-4">{interviews[1].question}</h4>
									<p className="text-sm text-white leading-relaxed whitespace-pre-line">
										{interviews[1].answer}
									</p>
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
