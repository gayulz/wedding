
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

interface RsvpProps {
    onModalStateChange?: (isOpen: boolean) => void;
}

const Rsvp: React.FC<RsvpProps> = ({ onModalStateChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [isUpdate, setIsUpdate] = useState(false);

    // Form State
    const [side, setSide] = useState<'groom' | 'bride' | null>(null);
    const [attendance, setAttendance] = useState<'yes' | 'no' | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async () => {
        if (!side || !attendance || !name || !phone) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        setSubmitting(true);
        try {
            // 중복 체크
            const q = query(
                collection(db, 'rsvp'),
                where('guest_name', '==', name),
                where('guest_phone', '==', phone)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // 이미 존재하면 업데이트
                const docId = querySnapshot.docs[0].id;
                const docRef = doc(db, 'rsvp', docId);

                await updateDoc(docRef, {
                    guest: side === 'groom' ? '신랑' : '신부',
                    visited: attendance === 'yes',
                    timestamp: serverTimestamp()
                });

                setIsUpdate(true);
                setStep('success');
                return;
            }

            // 없으면 새로 추가
            await addDoc(collection(db, 'rsvp'), {
                guest: side === 'groom' ? '신랑' : '신부',
                guest_name: name,
                guest_phone: phone,
                visited: attendance === 'yes',
                timestamp: serverTimestamp()
            });
            setIsUpdate(false);
            setStep('success');
        } catch (error) {
            console.error('Error saving document: ', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`오류가 발생했습니다: ${errorMessage}\n(Firebase 콘솔의 규칙(Rules)이나 API 키를 확인해주세요)`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        onModalStateChange?.(false);
        // Reset form after delay
        setTimeout(() => {
            setStep('form');
            setSide(null);
            setAttendance(null);
            setName('');
            setPhone('');
            setIsUpdate(false);
        }, 300);
    };

    const handleOpen = () => {
        setIsModalOpen(true);
        onModalStateChange?.(true);
    };

    return (
        <div className="relative h-full w-full flex flex-col items-center bg-[#f8f8f8] pt-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full px-6 flex flex-col items-center"
            >
                <p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">RSVP</p>
                <h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">참석 의사 전달하기</h2>
                <div className="w-8 h-[1px] bg-gray-200 mx-auto mb-8"></div>
                <p className="text-sm font-gowoon text-gray-500 mb-10">모든 분들을 소중히 모실 수 있도록 전해주세요</p>

                <div className="w-full max-w-sm bg-gray-100 rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-6 text-gray-700 font-gowoon text-lg">
                        <span>신랑 최봉석</span>
                        <span className="text-pink-400 text-sm">♥</span>
                        <span>신부 김가율</span>
                    </div>

                    <div className="w-full h-[1px] bg-gray-200 mb-6"></div>

                    <div className="space-y-2 text-gray-600 mb-8 font-myeongjo text-base">
                        <p>2026년 3월 14일</p>
                        <p>토요일 오후 2시</p>
                        <p className="pt-2 font-gowoon text-sm opacity-80">구미 토미스퀘어가든</p>
                    </div>

                    <button
                        onClick={handleOpen}
                        className="w-full py-4 bg-[#8E8E8E] text-white rounded-xl text-sm font-nanumsquare hover:bg-[#7a7a7a] transition-colors"
                    >
                        참석 의사 체크하기
                    </button>
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="absolute inset-0 bg-black/60"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white w-full max-w-[430px] rounded-t-[2rem] sm:rounded-2xl p-8 pb-10 sm:pb-8 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>

                            {step === 'form' ? (
                                <>
                                    <div className="text-center mb-8">
                                        <h3 className="text-xl font-myeongjo text-gray-800 mb-2">참석 의사 체크하기</h3>
                                        <p className="text-xs text-gray-400">
                                            한 분 한 분을 소중히 모실 수 있도록<br />
                                            참석 의사를 전해주시면 감사하겠습니다.
                                        </p>
                                    </div>

                                    <div className="space-y-6 text-left">
                                        {/* Side Selection */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-2 font-joseon">어느 분의 하객이신가요? <span className="text-red-400">*</span></label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setSide('groom')}
                                                    className={`py-3 rounded-xl border text-sm transition-all font-nanumsquare ${side === 'groom'
                                                        ? 'bg-[#8E8E8E] text-white border-[#8E8E8E]'
                                                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    신랑
                                                </button>
                                                <button
                                                    onClick={() => setSide('bride')}
                                                    className={`py-3 rounded-xl border text-sm transition-all font-nanumsquare ${side === 'bride'
                                                        ? 'bg-[#8E8E8E] text-white border-[#8E8E8E]'
                                                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    신부
                                                </button>
                                            </div>
                                        </div>

                                        {/* Attendance Selection */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-2 font-joseon">참석하실 수 있나요? <span className="text-red-400">*</span></label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setAttendance('yes')}
                                                    className={`py-3 rounded-xl border text-sm transition-all font-nanumsquare ${attendance === 'yes'
                                                        ? 'bg-[#8E8E8E] text-white border-[#8E8E8E]'
                                                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    참석할게요
                                                </button>
                                                <button
                                                    onClick={() => setAttendance('no')}
                                                    className={`py-3 rounded-xl border text-sm transition-all font-nanumsquare ${attendance === 'no'
                                                        ? 'bg-[#8E8E8E] text-white border-[#8E8E8E]'
                                                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    참석이 어려워요
                                                </button>
                                            </div>
                                        </div>

                                        {/* Name Input */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-2 font-joseon">성함이 어떻게 되시나요? <span className="text-red-400">*</span></label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="참석자 본인 성함"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors font-nanumsquare"
                                            />
                                        </div>

                                        {/* Phone Input */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-2 font-joseon">동명이인 체크를 위한 번호를 알려주세요 <span className="text-red-400">*</span></label>
                                            <input
                                                type="text"
                                                value={phone}
                                                maxLength={4}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    setPhone(val);
                                                }}
                                                placeholder="핸드폰 번호 뒤 4자리"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors font-nanumsquare"
                                            />
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="w-full py-4 bg-[#8E8E8E] text-white rounded-xl text-sm font-nanumsquare hover:bg-[#7a7a7a] transition-colors disabled:opacity-50 mt-4"
                                        >
                                            {submitting ? <i className="fa-solid fa-spinner fa-spin"></i> : '체크 완료하기'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <i className="fa-solid fa-check text-2xl"></i>
                                    </div>
                                    <h3 className="text-xl font-myeongjo text-gray-800 mb-2">
                                        {isUpdate ? '제출하신 내용을 수정했습니다' : '제출되었습니다'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-8">
                                        소중한 의사 전달 감사합니다.<br />
                                        예식일에 뵙겠습니다.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="px-8 py-3 bg-[#8E8E8E] text-white rounded-xl text-sm font-medium hover:bg-[#7a7a7a] transition-colors"
                                    >
                                        닫기
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Rsvp;
