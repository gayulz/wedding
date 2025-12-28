
import React, { useEffect } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

const ShareButton: React.FC = () => {
  useEffect(() => {
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      const kakaoKey = import.meta.env.VITE_KAKAO_API_KEY;
      if (kakaoKey) {
        window.Kakao.init(kakaoKey);
      }
    }
  }, []);

  const handleShare = () => {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '최봉석 ❤️ 김가율 결혼합니다',
          description: '2026년 3월 14일 토요일 오후 2시\n구미 토미스퀘어가든 4층 스퀘어가든 홀',
          imageUrl: window.location.origin + '/images/wedding-37.jpeg',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } else {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-8 left-8 z-[60] w-14 h-14 bg-[#FEE500] text-[#3c1e1e] rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95 hover:scale-110"
    >
      <i className="fa-solid fa-comment text-2xl"></i>
    </button>
  );
};

export default ShareButton;
