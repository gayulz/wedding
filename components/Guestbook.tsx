
import React, { useState, useEffect } from 'react';
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

const Guestbook: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [showWritePopup, setShowWritePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);
  const [hasSetInitialAccordion, setHasSetInitialAccordion] = useState(false);

  // 수정 관련 state
  const [editingEntry, setEditingEntry] = useState<GuestbookEntry | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  // 커스텀 alert 팝업
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const itemsPerPage = 5;

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

  // 방명록 작성
  const handleSubmit = async () => {
    console.log('Submit started');

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
    console.log('Starting to add document...');

    try {
      const docData = {
        name: name.trim(),
        password: password,
        message: message.trim(),
        createdAt: Timestamp.now()
      };

      console.log('Document data:', docData);

      const docRef = await addDoc(collection(db, 'guestbook'), docData);

      console.log('Document added successfully with ID:', docRef.id);

      // 입력 필드 초기화
      setName('');
      setPassword('');
      setMessage('');
      setShowWritePopup(false);
      showCustomAlert('축하 메시지가 전달되었습니다! 💕');
    } catch (error: any) {
      console.error('Error adding document: ', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      showCustomAlert(`메시지 전송에 실패했습니다.\n${error.message}`);
    } finally {
      setLoading(false);
      console.log('Submit finished');
    }
  };

  // Edit 버튼 클릭 - 비밀번호 입력 팝업 열기
  const handleEditClick = (entry: GuestbookEntry) => {
    setEditingEntry(entry);
    setEditPassword('');
    setPasswordVerified(false);
    setShowPasswordPopup(true);
  };

  // 비밀번호 확인
  const handlePasswordVerify = () => {
    if (!editPassword.trim() || editPassword.length !== 4 || !/^\d{4}$/.test(editPassword)) {
      showCustomAlert('비밀번호는 4자리 숫자여야 합니다.');
      return;
    }

    if (!editingEntry) return;

    // 비밀번호 확인
    if (editPassword !== editingEntry.password) {
      showCustomAlert('비밀번호가 일치하지 않습니다.');
      setEditPassword('');
      return;
    }

    // 비밀번호 일치 - 수정 화면으로 전환
    setPasswordVerified(true);
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
    console.log('Starting to update document...');

    try {
      const docRef = doc(db, 'guestbook', editingEntry.id);

      await updateDoc(docRef, {
        message: editMessage.trim()
      });

      console.log('Document updated successfully');

      // 초기화
      setEditingEntry(null);
      setEditPassword('');
      setEditMessage('');
      setPasswordVerified(false);
      setShowEditPopup(false);
      showCustomAlert('메시지가 수정되었습니다! ✏️');
    } catch (error: any) {
      console.error('Error updating document: ', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      showCustomAlert(`메시지 수정에 실패했습니다.\n${error.message}`);
    } finally {
      setLoading(false);
      console.log('Update finished');
    }
  };

  // 페이지네이션
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const currentEntries = entries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 첫 번째 아코디언 자동 열기
  useEffect(() => {
    if (!hasSetInitialAccordion && currentEntries.length > 0) {
      setOpenAccordionId(currentEntries[0].id);
      setHasSetInitialAccordion(true);
    }
  }, [currentEntries, hasSetInitialAccordion]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 text-white p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-xl font-myeongjo text-white/90 tracking-[0.2em] mb-4">COUNTDOWN</h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 justify-center items-center"
        >
          {[
            { label: 'Days', val: timeLeft.days },
            { label: 'Hours', val: timeLeft.hours },
            { label: 'Mins', val: timeLeft.mins },
            { label: 'Secs', val: timeLeft.secs }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-16 md:w-20 md:h-24 glass-card rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-light">
                {String(item.val).padStart(2, '0')}
              </div>
              <span className="text-[10px] uppercase text-white/40 mt-2 tracking-widest">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* 축하메세지 작성 버튼 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onClick={() => setShowWritePopup(true)}
        className="w-full max-w-md mb-8 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-sm tracking-widest hover:bg-yellow-100/80 transition-colors"
      >
        💍 축하메세지 작성 💍
      </motion.button>

      {/* 방명록 목록 - 아코디언 (최소 높이 고정) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full max-w-md space-y-3 mb-8"
        style={{ minHeight: '400px' }}
      >
        {currentEntries.length > 0 ? (
          currentEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenAccordionId(openAccordionId === entry.id ? null : entry.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white/90">{entry.name}</span>
                  <span className="text-xs text-white/40">
                    {entry.createdAt?.toDate().toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <i className={`fa-solid fa-chevron-down text-white/60 text-xs transition-transform ${openAccordionId === entry.id ? 'rotate-180' : ''}`}></i>
              </button>
              <AnimatePresence>
                {openAccordionId === entry.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-white/10">
                      <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap mb-3">{entry.message}</p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="px-3 py-1.5 bg-white/10 text-white rounded-md text-xs font-medium hover:bg-white/20 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <p className="text-center text-white/40 text-sm py-8">아직 작성된 방명록이 없습니다.</p>
        )}
      </motion.div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex gap-2 mb-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

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
                    setPasswordVerified(false);
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

      <p className="mt-12 text-white/30 text-[10px] text-center font-light uppercase tracking-[0.3em]">
        Design by Gayul
      </p>
    </div>
  );
};

export default Guestbook;
