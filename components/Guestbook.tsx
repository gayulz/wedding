
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, doc, updateDoc } from 'firebase/firestore';

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

  // 스크롤 컨테이너 ref (Location 컴포넌트와 동일한 방식)
  const containerRef = useRef<HTMLDivElement>(null);

  // 수정 관련 state
  const [editingEntry, setEditingEntry] = useState<GuestbookEntry | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  // 커스텀 alert 팝업
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // 커스텀 alert 함수
  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  // 실시간 방명록 불러오기 (오래된 순서 - 시안 스타일대로 렌더링)
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

  // 스크롤 이벤트 제어 (Location.tsx 방식 도입)
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
      showCustomAlert('이름을 입력해주세요.');
      return;
    }
    if (!password.trim() || password.length !== 4 || !/^\d{4}$/.test(password)) {
      showCustomAlert('비밀번호는 4자리 숫자여야 합니다.');
      return;
    }
    if (!message.trim()) {
      showCustomAlert('메시지를 입력해주세요.');
      return;
    }
    if (message.length > 300) {
      showCustomAlert('메시지는 300자를 초과할 수 없습니다.');
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
      showCustomAlert('축하 메시지가 전달되었습니다! 💕');
    } catch (error: any) {
      showCustomAlert(`메시지 전송에 실패했습니다.\n${error.message}`);
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
      showCustomAlert('비밀번호는 4자리 숫자여야 합니다.');
      return;
    }
    if (!editingEntry) return;

    if (editPassword !== editingEntry.password) {
      showCustomAlert('비밀번호가 일치하지 않습니다.');
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
      showCustomAlert('메시지를 입력해주세요.');
      return;
    }
    if (editMessage.length > 300) {
      showCustomAlert('메시지는 300자를 초과할 수 없습니다.');
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
      showCustomAlert('메시지가 수정되었습니다! ✏️');
    } catch (error: any) {
      showCustomAlert(`메시지 수정에 실패했습니다.\n${error.message}`);
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
      className="relative h-full w-full flex flex-col items-center bg-[#f8f8f8] overflow-y-auto overflow-x-hidden no-scrollbar pb-20"
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
        <p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">MESSAGE</p>
        <h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">축하의 한마디</h2>
        <div className="w-8 h-[1px] bg-gray-200 mx-auto mb-8"></div>
        <p className="text-sm font-gowoon text-gray-500">저희 둘에게 따뜻한 방명록을 남겨주세요</p>
      </motion.div>

      {/* 방명록 목록 (시안 카드 스타일) - 하단 여백 추가하여 버튼에 가려지지 않게 함 */}
      <div className="w-full max-w-sm px-6 space-y-4 pb-32">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-50/50"
            >
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
          ))
        ) : (
          <p className="text-center text-gray-400 text-xs py-10 font-gowoon">아직 작성된 방명록이 없습니다.</p>
        )}

      </div>

      {/* 버튼 고정 영역 - 뒷 컨텐츠가 비치지 않도록 Solid 배경 적용 및 위치 하단 밀착 */}
      <div className="sticky bottom-0 w-full max-w-sm px-6 pb-6 pt-4 bg-[#f8f8f8] shrink-0 mt-auto z-[50] shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.03)]">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onClick={() => setShowWritePopup(true)}
          className="w-full py-4 bg-[#8E8E8E] text-white rounded-xl text-sm font-nanumsquare hover:bg-[#7a7a7a] transition-all shadow-lg active:scale-95"
        >
          메시지 남기기
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
                <h3 className="text-xl font-myeongjo text-gray-800">축하 메시지 작성하기</h3>
                <p className="text-xs font-gowoon text-gray-500">저희 둘의 결혼을 함께 축하해 주세요</p>
              </div>

              <div className="space-y-4 pt-4">
                <input
                  type="text"
                  placeholder="성함을 남겨주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-gray-100 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-300 font-nanumsquare shadow-inner"
                />
                <input
                  type="password"
                  placeholder="비밀번호를 입력해 주세요 (숫자 4자리)"
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
                  placeholder="200자 이내로 작성해 주세요"
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
                {loading ? '작성 중...' : '작성 완료'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 비밀번호 확인 팝업 (디자인 리뉴얼) */}
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
              <h3 className="text-center font-myeongjo text-lg text-gray-800">비밀번호 확인</h3>
              <input
                type="password"
                placeholder="비밀번호 숫자 4자리"
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
                  취소
                </button>
                <button
                  onClick={handlePasswordVerify}
                  className="flex-1 py-3 bg-[#8E8E8E] text-white rounded-xl text-xs font-nanumsquare font-bold"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 수정 팝업 (디자인 리뉴얼) */}
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

              <h3 className="text-center font-myeongjo text-xl text-gray-800">메시지 수정하기</h3>

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
                {loading ? '수정 중...' : '수정 완료'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 커스텀 Alert (디자인 리뉴얼) */}
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
              <p className="text-gray-800 text-sm font-nanumsquare mb-6 leading-relaxed">
                {alertMessage}
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold text-xs"
              >
                확인
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Guestbook;
