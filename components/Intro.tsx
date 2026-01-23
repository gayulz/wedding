import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalBackHandler } from '@/hooks/useModalBackHandler';
import { loadImage } from '@/lib/image-loader';
import { weddingData } from '@/data/content';

const Intro: React.FC = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    // ESC 키 및 뒤로가기 버튼으로 팝업 닫기
    useModalBackHandler(isContactOpen, () => setIsContactOpen(false));

    // 팝업 열릴 때 스크롤 차단
    useEffect(() => {
        if (isContactOpen) {
            const preventScroll = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
            };

            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });

            return () => {
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
            };
        }
    }, [isContactOpen]);

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

    // 연락처 정보
    const { groom, bride } = weddingData.common;

    return (
        <div
            className="relative h-full w-full flex flex-col items-center px-8 pb-12 text-center"
        >

            <div className="relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-8 max-w-lg"
                >
                    <motion.div variants={itemVariants} className="pt-8 pb-3">
                        <p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">{weddingData.intro.label}</p>
                        <h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">{weddingData.intro.title}</h2>
                        <div className="w-8 h-[1px] bg-gray-200 mx-auto mt-2"></div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="font-myeongjo text-[12px] leading-relaxed text-gray-700 whitespace-pre-line space-y-6">
                        {weddingData.intro.mainText}
                    </motion.div>

                    {/* 부모님 이름 */}
                    <motion.div variants={itemVariants} className="space-y-4 pt-4 font-gowoon">
                        <p className="text-base text-gray-700">
                            <span className="font-normal">{groom.parents.mother.name}</span>
                            <span className="text-xs text-gray-400 mx-2">의 {groom.parents.relation}</span>
                            <span className="font-bold text-lg">{groom.name}</span>
                        </p>
                        <p className="text-base text-gray-700">
                            <span className="font-normal">{bride.parents.father.name}</span>
                            <span className="text-xs text-gray-400 mx-2">의 {bride.parents.relation}</span>
                            <span className="font-bold text-lg">{bride.name}</span>
                        </p>
                    </motion.div>

                    {/* 연락하기 버튼 */}
                    <motion.button
                        variants={itemVariants}
                        onClick={() => setIsContactOpen(true)}
                        className="mt-8 px-12 py-3 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <i className="fa-solid fa-phone text-xs"></i>
                        <span>{weddingData.intro.contactButton}</span>
                    </motion.button>
                </motion.div>
            </div>


            {/* 연락처 모달 */}
            <AnimatePresence>
                {isContactOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsContactOpen(false)}
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
                            className="bg-[#3a3a3a] rounded-2xl p-8 w-full max-w-md relative"
                        >
                            {/* 닫기 버튼 */}
                            <button
                                onClick={() => setIsContactOpen(false)}
                                className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                            {/* 헤더 */}
                            <div className="text-center mb-8">
                                <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2">{weddingData.intro.modal.label}</p>
                                <h3 className="text-xl text-white font-myeongjo">{weddingData.intro.modal.title}</h3>
                            </div>

                            {/* 신랑측 */}
                            <div className="mb-8">
                                <h4 className="text-xs text-gray-400 tracking-[0.2em] uppercase mb-4">{weddingData.intro.modal.groomSide} <span className="text-[10px]">{weddingData.intro.modal.groomLabel}</span></h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400 w-20">신랑</span>
                                            <span className="text-white">{groom.name}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <a href={`tel:${groom.phone}`} className="text-white/80 hover:text-white">
                                                <i className="fa-solid fa-phone"></i>
                                            </a>
                                            <a href={`sms:${groom.phone}`} className="text-white/80 hover:text-white">
                                                <i className="fa-solid fa-envelope"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400 w-20">신랑 어머니</span>
                                            <span className="text-white">{groom.parents.mother.name}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <a href={`tel:${groom.parents.mother.phone}`} className="text-white/80 hover:text-white">
                                                <i className="fa-solid fa-phone"></i>
                                            </a>
                                            <a href={`sms:${groom.parents.mother.phone}`} className="text-white/80 hover:text-white">
                                                <i className="fa-solid fa-envelope"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 신부측 */}
                            <div>
                                <h4 className="text-xs text-gray-400 tracking-[0.2em] uppercase mb-4">{weddingData.intro.modal.brideSide} <span className="text-[10px]">{weddingData.intro.modal.brideLabel}</span></h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400 w-20">신부</span>
                                            <span className="text-white">{bride.name}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <a href={`tel:${bride.phone}`} className="text-white/80 hover:text-white">
                                                <i className="fa-solid fa-phone"></i>
                                            </a>
                                            <a href={`sms:${bride.phone}`} className="text-white/80 hover:text-white">
                                                <i className="fa-solid fa-envelope"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400 w-20">신부 아버지</span>
                                            <span className="text-white">{bride.parents.father.name}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <a href={`tel:${bride.parents.father.phone}`} className="text-white/80 hover:text-white">
                                                <i className="fa-solid fa-phone"></i>
                                            </a>
                                            <a href={`sms:${bride.parents.father.phone}`} className="text-white/80 hover:text-white">
                                                <i className="fa-solid fa-envelope"></i>
                                            </a>
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

export default Intro;