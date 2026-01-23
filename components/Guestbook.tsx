import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalBackHandler } from '@/hooks/useModalBackHandler';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { weddingData } from '@/data/content';

interface GuestbookEntry {
  id: string;
  name: string;
  password: string;
  message: string;
  createdAt: Timestamp;
}

interface GuestbookProps {
  onModalStateChange: (isOpen: boolean) => void;
}

const Guestbook: React.FC<GuestbookProps> = ({ onModalStateChange }) => {
  const [showWritePopup, setShowWritePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // PC Drag-to-Scroll State
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);



  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    // Ignore interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, textarea, [role="button"], .interactive')) {
      return;
    }

    setIsDragging(true);
    setStartY(e.pageY);
    setStartScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const y = e.pageY;
    const walk = (y - startY) * 1.5; // Drag speed multiplier
    containerRef.current.scrollTop = startScrollTop - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // 스크롤 컨테이너 ref
  const containerRef = useRef<HTMLDivElement>(null);

  // 수정 관련 state
  const [editingEntry, setEditingEntry] = useState<GuestbookEntry | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  // 커스텀 alert 팝업
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // [MIG] 통합 뒤로가기 핸들러
  // 어떤 팝업이든 열려있으면 true
  const isAnyPopupOpen = showWritePopup || showEditPopup || showPasswordPopup || showAlert;

  useModalBackHandler(isAnyPopupOpen, () => {
    // 열려있는 순서대로 닫기 (우선순위가 있다면 조정)
    if (showAlert) {
      setShowAlert(false);
      return;
    }
    if (showPasswordPopup) {
      setShowPasswordPopup(false);
      setEditingEntry(null);
      setEditPassword('');
      return;
    }
    if (showEditPopup) {
      setShowEditPopup(false);
      return;
    }
    if (showWritePopup) {
      setShowWritePopup(false);
      return;
    }
  });

  // 커스텀 alert 함수
  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  // 실시간 방명록 불러오기
  useEffect(() => {
    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEntries: GuestbookEntry[] = [];
      snapshot.forEach((doc) => {
        newEntries.push({
          id: doc.id,
          ...doc.data()
        } as GuestbookEntry);
      });
      setEntries(newEntries);
    });

    return () => unsubscribe();
  }, []);

  // 스크롤 이벤트 제어
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrollDown = e.deltaY > 0;
      const isScrollUp = e.deltaY < 0;

      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      const isAtTop = scrollTop <= 0;

      if ((isScrollDown && !isAtBottom) || (isScrollUp && !isAtTop)) {
        e.stopPropagation();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // 방명록 작성
  const handleSubmit = async () => {
    if (!name.trim()) {
      showCustomAlert(weddingData.guestbook.alert.name);
      return;
    }
    if (!password.trim() || password.length !== 4 || !/^\d{4}$/.test(password)) {
      showCustomAlert(weddingData.guestbook.alert.password);
      return;
    }
    if (!message.trim()) {
      showCustomAlert(weddingData.guestbook.alert.message);
      return;
    }
    if (message.length > 300) {
      showCustomAlert(weddingData.guestbook.alert.length);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        password: password,
        message: message.trim(),
        createdAt: Timestamp.now()
      });
      setName('');
      setPassword('');
      setMessage('');
      setShowWritePopup(false);
      showCustomAlert(weddingData.guestbook.success.create);
    } catch (error: any) {
      showCustomAlert(`${weddingData.guestbook.alert.fail}\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Edit 버튼 클릭
  const handleEditClick = (entry: GuestbookEntry) => {
    setEditingEntry(entry);
    setEditPassword('');
    setShowPasswordPopup(true);
  };

  // 비밀번호 확인
  const handlePasswordVerify = () => {
    if (!editPassword.trim() || editPassword.length !== 4 || !/^\d{4}$/.test(editPassword)) {
      showCustomAlert(weddingData.guestbook.alert.password);
      return;
    }
    if (!editingEntry) return;

    if (editPassword !== editingEntry.password) {
      showCustomAlert(weddingData.guestbook.alert.passwordMismatch);
      setEditPassword('');
      return;
    }

    setEditMessage(editingEntry.message);
    setShowPasswordPopup(false);
    setShowEditPopup(true);
  };

  // 수정 처리
  const handleEdit = async () => {
    if (!editingEntry) return;
    if (!editMessage.trim()) {
      showCustomAlert(weddingData.guestbook.alert.message);
      return;
    }
    if (editMessage.length > 300) {
      showCustomAlert(weddingData.guestbook.alert.length);
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'guestbook', editingEntry.id);
      await updateDoc(docRef, { message: editMessage.trim() });
      setEditingEntry(null);
      setEditPassword('');
      setEditMessage('');
      setShowEditPopup(false);
      showCustomAlert(weddingData.guestbook.success.update);
    } catch (error: any) {
      showCustomAlert(`${weddingData.guestbook.alert.fail}\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 팝업 오픈 시 배경 스크롤 잠금
  useEffect(() => {
    const isAnyPopupOpen = showWritePopup || showEditPopup || showPasswordPopup || showAlert;
    if (isAnyPopupOpen) {
      document.body.style.overflow = 'hidden';
      onModalStateChange(true);
    } else {
      document.body.style.overflow = '';
      onModalStateChange(false);
    }
    return () => {
      document.body.style.overflow = '';
      onModalStateChange(false);
    };
  }, [showWritePopup, showEditPopup, showPasswordPopup, showAlert, onModalStateChange]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full flex flex-col items-center bg-white overflow-y-auto overflow-x-hidden no-scrollbar pb-20 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={(e) => {
        const container = containerRef.current;
        if (!container) return;
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 2;
        if (!isAtTop && !isAtBottom) {
          e.stopPropagation();
        }
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        const container = containerRef.current;
        if (!container) return;
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 2;
        if (!isAtTop && !isAtBottom) {
          e.stopPropagation();
        }
      }}
    >
      {/* 헤더 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center pt-8 pb-10 px-6 shrink-0"
      >
        <p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">{weddingData.guestbook.label}</p>
        <h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">{weddingData.guestbook.title}</h2>
        <div className="w-8 h-[1px] bg-gray-200 mx-auto mb-8"></div>
        <p className="text-sm font-gowoon text-gray-500">{weddingData.guestbook.subtitle}</p>
      </motion.div>

      {/* 방명록 목록 */}
      <div className="w-full max-w-sm px-6 space-y-4 pb-12">
        {entries.length > 0 ? (
          <>
            {(isExpanded ? entries : entries.slice(0, 4)).map((entry, index) => {
              const isPeekItem = !isExpanded && index === 3;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`relative bg-white rounded-2xl p-6 shadow-md border border-gray-50/50`}
                >
                  {isPeekItem && (
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-white/80 to-white z-10" />
                  )}
                  {/* 수정 버튼 (아이콘) */}
                  <button
                    onClick={() => handleEditClick(entry)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>

                  {/* 메시지 본문 */}
                  <p className="text-[14px] leading-relaxed text-gray-700 font-nanumsquare mb-6 whitespace-pre-wrap break-words">
                    {entry.message}
                  </p>

                  {/* 하단 정보 */}
                  <div className="flex justify-between items-center text-[11px] font-nanumsquare">
                    <span className="text-gray-400">From {entry.name}</span>
                    <span className="text-gray-300">
                      {entry.createdAt ? (
                        entry.createdAt.toDate().toLocaleDateString('ko-KR') + ' ' +
                        entry.createdAt.toDate().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
                      ) : ''}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {!isExpanded && entries.length > 3 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center gap-3 py-6 group -mt-16 relative z-20"
              >
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent group-hover:via-gray-900/40 transition-all" />
                <span className="text-xs font-nanumsquare text-gray-400 group-hover:text-gray-600 transition-colors">
                  {weddingData.guestbook.loadMore}
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent group-hover:via-gray-900/40 transition-all" />
              </motion.button>
            )}

            {isExpanded && (
              <div className="space-y-4 pt-4">
                <motion.button
                  key="fold-btn-static"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    setIsExpanded(false);
                    // 접었을 때 상단으로 스크롤 이동
                    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full flex items-center gap-3 py-4 group"
                >
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent group-hover:via-gray-900/40 transition-all" />
                  <span className="text-xs font-nanumsquare text-gray-400 group-hover:text-gray-600 transition-colors">
                    {weddingData.guestbook.fold}
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent group-hover:via-gray-900/40 transition-all" />
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400 text-xs py-10 font-gowoon">{weddingData.guestbook.empty}</p>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowWritePopup(true);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          className="w-full py-4 bg-[#8E8E8E] text-white rounded-xl text-sm font-nanumsquare hover:bg-[#7a7a7a] transition-all shadow-lg active:scale-95 z-30 relative interactive"
        >
          {weddingData.guestbook.button}
        </motion.button>
      </div>

      {/* 작성 팝업 */}
      <AnimatePresence>
        {showWritePopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWritePopup(false)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-white rounded-3xl p-8 space-y-6 z-10 shadow-2xl relative"
            >
              <button
                onClick={() => setShowWritePopup(false)}
                className="absolute top-6 right-6 text-gray-400"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-myeongjo text-gray-800">{weddingData.guestbook.write.title}</h3>
                <p className="text-xs font-gowoon text-gray-500">{weddingData.guestbook.write.subtitle}</p>
              </div>

              <div className="space-y-4 pt-4">
                <input
                  type="text"
                  placeholder={weddingData.guestbook.write.placeholder.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-300 font-nanumsquare shadow-inner"
                />
                <input
                  type="password"
                  placeholder={weddingData.guestbook.write.placeholder.password}
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setPassword(value);
                  }}
                  maxLength={4}
                  inputMode="numeric"
                  className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-300 font-nanumsquare shadow-inner"
                />
                <textarea
                  placeholder={weddingData.guestbook.write.placeholder.message}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                  maxLength={200}
                  className="w-full h-40 bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-300 font-nanumsquare resize-none shadow-inner"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[#8E8E8E] text-white rounded-xl text-sm font-nanumsquare font-bold hover:bg-[#7a7a7a] transition-all disabled:opacity-50"
              >
                {loading ? weddingData.guestbook.write.submit.loading : weddingData.guestbook.write.submit.default}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 비밀번호 확인 팝업 */}
      <AnimatePresence>
        {showPasswordPopup && editingEntry && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPasswordPopup(false);
                setEditingEntry(null);
                setEditPassword('');
              }}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-white rounded-2xl p-8 space-y-6 z-10 shadow-2xl"
            >
              <h3 className="text-center font-myeongjo text-lg text-gray-800">{weddingData.guestbook.password.title}</h3>
              <input
                type="password"
                placeholder={weddingData.guestbook.password.placeholder}
                value={editPassword}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setEditPassword(value);
                }}
                maxLength={4}
                autoFocus
                className="w-full bg-[#f8f8f8] border border-gray-100 rounded-xl p-4 text-center text-sm font-nanumsquare focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowPasswordPopup(false);
                    setEditingEntry(null);
                    setEditPassword('');
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl text-xs font-nanumsquare"
                >
                  {weddingData.guestbook.password.cancel}
                </button>
                <button
                  onClick={handlePasswordVerify}
                  className="flex-1 py-3 bg-[#8E8E8E] text-white rounded-xl text-xs font-nanumsquare font-bold"
                >
                  {weddingData.guestbook.password.confirm}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 수정 팝업 */}
      <AnimatePresence>
        {showEditPopup && editingEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditPopup(false)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl p-8 space-y-6 z-10 shadow-2xl relative"
            >
              <button
                onClick={() => setShowEditPopup(false)}
                className="absolute top-6 right-6 text-gray-400"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>

              <h3 className="text-center font-myeongjo text-xl text-gray-800">{weddingData.guestbook.edit.title}</h3>

              <div className="space-y-4 pt-4">
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-xs font-nanumsquare text-gray-400">
                  작성자: {editingEntry.name}
                </div>
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value.slice(0, 200))}
                  maxLength={200}
                  className="w-full h-40 bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all font-nanumsquare resize-none"
                />
              </div>

              <button
                onClick={handleEdit}
                disabled={loading}
                className="w-full py-4 bg-[#8E8E8E] text-white rounded-xl text-sm font-nanumsquare font-bold hover:bg-[#7a7a7a] transition-all"
              >
                {loading ? weddingData.guestbook.edit.submit.loading : weddingData.guestbook.edit.submit.default}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 커스텀 Alert */}
      <AnimatePresence>
        {showAlert && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAlert(false)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[280px] bg-white rounded-2xl p-6 text-center z-10 shadow-2xl"
            >
              <p className="text-gray-800 text-sm font-nanumsquare mb-6 leading-relaxed whitespace-pre-line">
                {alertMessage}
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold text-xs"
              >
                {weddingData.guestbook.password.confirm}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Guestbook;
