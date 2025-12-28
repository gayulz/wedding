
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: Timestamp;
}

const Guestbook: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(false);

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
      orderBy('createdAt', 'desc'),
      limit(10)
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
    if (!name.trim() || !message.trim()) {
      alert('이름과 메시지를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        createdAt: Timestamp.now()
      });
      
      // 입력 필드 초기화
      setName('');
      setMessage('');
      alert('축하 메시지가 전달되었습니다! 💕');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-myeongjo text-white/90 tracking-[0.2em] mb-4">COUNTDOWN</h2>
        <div className="flex gap-4 justify-center items-center">
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
        </div>
      </div>

      <div className="w-full max-w-md liquid-glass p-8 space-y-4 mb-8">
        <h3 className="text-center font-myeongjo text-lg">방명록 남기기</h3>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all placeholder:text-white/20"
        />
        <textarea 
          placeholder="축하의 메시지를 남겨주세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all placeholder:text-white/20"
        />
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-sm tracking-widest hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '전송 중...' : '메시지 보내기'}
        </button>
      </div>

      {/* 최근 방명록 표시 */}
      {entries.length > 0 && (
        <div className="w-full max-w-md space-y-3">
          <h4 className="text-center text-sm text-white/60 mb-4">최근 방명록</h4>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/90">{entry.name}</span>
                <span className="text-xs text-white/40">
                  {entry.createdAt?.toDate().toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{entry.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      <p className="mt-12 text-white/30 text-[10px] text-center font-light uppercase tracking-[0.3em]">
        Design by Gayul
      </p>
    </div>
  );
};

export default Guestbook;
