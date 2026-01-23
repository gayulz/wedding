import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalBackHandler } from '@/hooks/useModalBackHandler';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { weddingData } from '@/data/content';

interface RsvpProps {
    onModalStateChange?: (isOpen: boolean) => void;
}

const Rsvp: React.FC<RsvpProps> = ({ onModalStateChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useModalBackHandler(isModalOpen, () => {
        setIsModalOpen(false);
        onModalStateChange?.(false);
        // Reset form logic duplicated from handleClose usually
        // But for back button, just closing is prioritized.
        // If we want FULL consistency, we should wrap handleClose logic.
    });
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
            alert(weddingData.rsvp.alert.allFields);
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
            alert(`${weddingData.rsvp.alert.error}: ${errorMessage}\n(Firebase 콘솔의 규칙(Rules)이나 API 키를 확인해주세요)`);
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
        <div className="relative h-full w-full flex flex-col items-center bg-white pt-8 pb-24 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full px-6 flex flex-col items-center"
            >
                <p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">{weddingData.rsvp.label}</p>
                <h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">{weddingData.rsvp.title}</h2>
                <div className="w-8 h-[1px] bg-gray-200 mx-auto mb-8"></div>
                <p className="text-sm font-gowoon text-gray-500 mb-10">{weddingData.rsvp.subtitle}</p>

                <div className="w-full max-w-sm bg-gray-100 rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-6 text-gray-700 font-gowoon text-lg">
                        <span>{weddingData.common.groom.name}</span>
                        <span className="text-pink-400 text-sm">{weddingData.rsvp.card.connector}</span>
                        <span>{weddingData.common.bride.name}</span>
                    </div>

                    <div className="w-full h-[1px] bg-gray-200 mb-6"></div>

                    <div className="space-y-2 text-gray-600 mb-8 font-myeongjo text-base">
                        <p>{weddingData.common.date.full}</p>
                        <p>{weddingData.common.date.time}</p>
                        <p className="pt-2 font-gowoon text-sm opacity-80">{weddingData.common.location.name}</p>
                    </div>

                    <button
                        onClick={handleOpen}
                        className="w-full py-4 bg-[#8E8E8E] text-white rounded-xl text-sm font-nanumsquare hover:bg-[#7a7a7a] transition-colors"
                    >
                        {weddingData.rsvp.card.button}
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
                                        <h3 className="text-xl font-myeongjo text-gray-900 mb-2">{weddingData.rsvp.form.title}</h3>
                                        <p className="text-xs text-gray-600 font-medium whitespace-pre-line">
                                            {weddingData.rsvp.form.description}
                                        </p>
                                    </div>

                                    <div className="space-y-6 text-left">
                                        {/* Side Selection */}
                                        <div>
                                            <label className="block text-sm text-gray-800 mb-2 font-joseon font-bold">{weddingData.rsvp.form.side.label} <span className="text-red-500">*</span></label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setSide('groom')}
                                                    className={`py-3 rounded-xl border text-sm transition-all font-nanumsquare font-medium ${side === 'groom'
                                                        ? 'bg-[#5A4D4D] text-white border-[#5A4D4D]'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {weddingData.rsvp.form.side.groom}
                                                </button>
                                                <button
                                                    onClick={() => setSide('bride')}
                                                    className={`py-3 rounded-xl border text-sm transition-all font-nanumsquare font-medium ${side === 'bride'
                                                        ? 'bg-[#5A4D4D] text-white border-[#5A4D4D]'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {weddingData.rsvp.form.side.bride}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Attendance Selection */}
                                        <div>
                                            <label className="block text-sm text-gray-800 mb-2 font-joseon font-bold">{weddingData.rsvp.form.attendance.label} <span className="text-red-500">*</span></label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setAttendance('yes')}
                                                    className={`py-3 rounded-xl border text-sm transition-all font-nanumsquare font-medium ${attendance === 'yes'
                                                        ? 'bg-[#5A4D4D] text-white border-[#5A4D4D]'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {weddingData.rsvp.form.attendance.yes}
                                                </button>
                                                <button
                                                    onClick={() => setAttendance('no')}
                                                    className={`py-3 rounded-xl border text-sm transition-all font-nanumsquare font-medium ${attendance === 'no'
                                                        ? 'bg-[#5A4D4D] text-white border-[#5A4D4D]'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {weddingData.rsvp.form.attendance.no}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Name Input */}
                                        <div>
                                            <label className="block text-sm text-gray-800 mb-2 font-joseon font-bold">{weddingData.rsvp.form.name.label} <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder={weddingData.rsvp.form.name.placeholder}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-500 transition-colors font-nanumsquare placeholder:text-gray-400"
                                            />
                                        </div>

                                        {/* Phone Input */}
                                        <div>
                                            <label className="block text-sm text-gray-800 mb-2 font-joseon font-bold">{weddingData.rsvp.form.phone.label} <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={phone}
                                                maxLength={4}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    setPhone(val);
                                                }}
                                                placeholder={weddingData.rsvp.form.phone.placeholder}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-500 transition-colors font-nanumsquare placeholder:text-gray-400"
                                            />
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="w-full py-4 bg-[#5A4D4D] text-white rounded-xl text-base font-bold font-nanumsquare hover:bg-[#4a3d3d] transition-colors disabled:opacity-50 mt-4 shadow-lg"
                                        >
                                            {submitting ? <i className="fa-solid fa-spinner fa-spin"></i> : weddingData.rsvp.form.submit.default}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-[#5A4D4D]/10 text-[#5A4D4D] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <i className="fa-solid fa-check text-2xl"></i>
                                    </div>
                                    <h3 className="text-xl font-myeongjo text-gray-900 mb-2 font-bold">
                                        {isUpdate ? weddingData.rsvp.success.update : weddingData.rsvp.success.new}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-8 font-medium whitespace-pre-line">
                                        {weddingData.rsvp.success.message}
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="px-8 py-3 bg-[#5A4D4D] text-white rounded-xl text-sm font-bold hover:bg-[#4a3d3d] transition-colors"
                                    >
                                        {weddingData.rsvp.success.button}
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
