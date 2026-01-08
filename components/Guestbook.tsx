
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

// Custom hook to get window height
const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowHeight;
};


const Guestbook: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [showWritePopup, setShowWritePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // 스크롤 컨테이너 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 수정 관련 state
  const [editingEntry, setEditingEntry] = useState<GuestbookEntry | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  // 커스텀 alert 팝업
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  
  const windowHeight = useWindowHeight();

  // 커스텀 alert 함수
  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  // Countdown Timer
  useEffect(() => {
    const target = new Date("2026-03-14T14:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 실시간 방명록 불러오기 (오래된 순서 - 채팅 스타일)
  useEffect(() => {
    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'asc') // 오래된 글이 위, 최신 글이 아래
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

  // --- 반응형 로직 ---
  const isVerySmallScreen = windowHeight < 680;
  const isSmallScreen = windowHeight < 750;

  const useSmallFont = isSmallScreen; // 750px 미만일때 모두 작은 폰트 사용
  // --- 반응형 로직 끝 ---

  // 새 메시지나 엔트리 변경 시 맨 아래로 스크롤
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [entries]);

  // 채팅 스크롤 시 페이지 전환 방지
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const preventPageScroll = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // 스크롤이 가능한 영역 내에 있으면 이벤트 전파 중단
      if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
        e.stopPropagation();
      }
    };

    const preventTouchScroll = (e: TouchEvent) => {
      // 터치 스크롤도 전파 방지
      e.stopPropagation();
    };

    scrollContainer.addEventListener('wheel', preventPageScroll, { passive: false });
    scrollContainer.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', preventPageScroll);
      scrollContainer.removeEventListener('touchmove', preventTouchScroll);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 text-white p-3 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3 text-center"
      >
        <h2 className="text-base font-myeongjo text-white/90 tracking-[0.2em] mb-3">COUNTDOWN</h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-2 justify-center items-center"
        >
          {[
            { label: 'Days', val: timeLeft.days },
            { label: 'Hours', val: timeLeft.hours },
            { label: 'Mins', val: timeLeft.mins },
            { label: 'Secs', val: timeLeft.secs }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-14 md:w-16 md:h-18 glass-card rounded-xl flex items-center justify-center text-xl md:text-3xl font-light">
                {String(item.val).padStart(2, '0')}
              </div>
              <span className="text-[9px] uppercase text-white/40 mt-1 tracking-widest">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* 방명록 목록 - 카톡 스타일 */}
      <motion.div
        ref={scrollContainerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md flex-1 overflow-y-auto space-y-3 mb-3 px-2"
        style={{
          maxHeight: 'calc(100vh - 320px)',
          minHeight: '300px'
        }}
      >
        {entries.length > 0 ? (
          entries.map((entry, index) => {
            // 인덱스 기반으로 번갈아가며 배치 (짝수는 왼쪽, 홀수는 오른쪽)
            const isRight = index % 2 === 1;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: isRight ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col ${isRight ? 'items-end' : 'items-start'}`}
              >
                {/* 이름과 날짜 */}
                <div className={`flex items-center gap-2 mb-1 ${isRight ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] text-white/90 font-medium">{entry.name}</span>
                  <span className="text-[9px] text-white/40">
                    {entry.createdAt?.toDate().toLocaleDateString('ko-KR')}
                  </span>
                </div>

                {/* 말풍선 */}
                <div className={`relative max-w-[80%] ${isRight ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`px-3 py-2 rounded-2xl ${
                      isRight
                        ? 'bg-yellow-400/90 text-gray-900 rounded-tr-sm'
                        : 'bg-white/10 text-white/90 rounded-tl-sm'
                    }`}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{entry.message}</p>
                  </div>

                  {/* Edit 버튼 */}
                  <button
                    onClick={() => handleEditClick(entry)}
                    className={`mt-1 text-[9px] text-white/50 hover:text-white/80 transition-colors ${
                      isRight ? 'self-end' : 'self-start'
                    }`}
                  >
                    수정
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-white/40 text-xs py-4">아직 작성된 방명록이 없습니다.</p>
        )}
      </motion.div>

      {/* 축하메세지 작성 버튼 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        onClick={() => setShowWritePopup(true)}
        className="w-full max-w-md mb-2 px-6 py-2.5 bg-white text-gray-900 rounded-xl font-bold tracking-widest hover:bg-yellow-100/80 transition-colors text-xs"
      >
        💍 축하메세지 작성 💍
      </motion.button>

      {/* 작성 팝업 */}
      <AnimatePresence>
        {showWritePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWritePopup(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 200, 0.05))',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl p-8 space-y-4"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="text-center font-myeongjo text-xl text-white mb-6">축하메세지 작성</h3>
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all placeholder:text-white/40"
              />
              <input
                type="password"
                placeholder="비밀번호 (숫자 4자리)"
                value={password}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPassword(value);
                }}
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all placeholder:text-white/40"
              />
              <div className="relative">
                <textarea
                  placeholder="축하의 메시지를 남겨주세요"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                  maxLength={300}
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all placeholder:text-white/40 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-white/40">
                  {message.length}/300
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowWritePopup(false)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '등록 중...' : '등록'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 비밀번호 확인 팝업 */}
      <AnimatePresence>
        {showPasswordPopup && editingEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowPasswordPopup(false);
              setEditingEntry(null);
              setEditPassword('');
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 200, 0.05))',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-8 space-y-4"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="text-center font-myeongjo text-xl text-white mb-6">비밀번호 확인</h3>
              <div className="bg-white/10 rounded-xl p-3 mb-4">
                <p className="text-xs text-white/60">작성자</p>
                <p className="text-sm text-white font-medium">{editingEntry.name}</p>
              </div>
              <input
                type="password"
                placeholder="비밀번호 (숫자 4자리)"
                value={editPassword}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setEditPassword(value);
                }}
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all placeholder:text-white/40"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPasswordPopup(false);
                    setEditingEntry(null);
                    setEditPassword('');
                  }}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handlePasswordVerify}
                  className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 수정 팝업 */}
      <AnimatePresence>
        {showEditPopup && editingEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditPopup(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 200, 0.05))',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl p-8 space-y-4"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="text-center font-myeongjo text-xl text-white mb-6">메시지 수정</h3>
              <div className="bg-white/10 rounded-xl p-3 mb-4">
                <p className="text-xs text-white/60">작성자</p>
                <p className="text-sm text-white font-medium">{editingEntry.name}</p>
              </div>
              <div className="relative">
                <textarea
                  placeholder="수정할 메시지를 입력해주세요"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value.slice(0, 300))}
                  maxLength={300}
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all placeholder:text-white/40 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-white/40">
                  {editMessage.length}/300
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowEditPopup(false);
                    setEditingEntry(null);
                    setEditPassword('');
                    setEditMessage('');
                  }}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '수정 중...' : '수정'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 커스텀 Alert 팝업 */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAlert(false)}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <p className="text-white text-sm leading-relaxed whitespace-pre-line mb-6">
                {alertMessage}
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-2 text-white/30 text-[9px] text-center font-light uppercase tracking-[0.3em]">
        Design by Gayul
      </p>
    </div>
  );
};

export default Guestbook;
