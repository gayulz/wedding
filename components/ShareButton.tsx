
import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

const ShareButton: React.FC = () => {
  const [isKakaoReady, setIsKakaoReady] = useState(false);

  useEffect(() => {
    // Kakao SDK 로드 대기 및 초기화
    const initializeKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        const kakaoKey = import.meta.env.VITE_KAKAO_API_KEY;
        if (kakaoKey) {
          window.Kakao.init(kakaoKey);
          setIsKakaoReady(true);
        }
      } else if (window.Kakao && window.Kakao.isInitialized()) {
        setIsKakaoReady(true);
      }
    };

    // 카카오 SDK가 로드될 때까지 대기
    if (window.Kakao) {
      initializeKakao();
    } else {
      // SDK가 아직 로드되지 않았으면 대기
      const checkInterval = setInterval(() => {
        if (window.Kakao) {
          initializeKakao();
          clearInterval(checkInterval);
        }
      }, 100);

      // 5초 후에도 로드되지 않으면 중단
      const timeout = setTimeout(() => clearInterval(checkInterval), 5000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const handleShare = () => {
    if (!isKakaoReady || !window.Kakao) {
      alert('카카오톡 공유 기능을 사용할 수 없습니다. 페이지를 새로고침해주세요.');
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const imageUrl = `${baseUrl}/images/wedding-37.jpeg`;

        /**
         *     "object_type": "feed",
         *         "content": {
         *             "title": "오늘의 디저트",
         *             "description": "아메리카노, 빵, 케익",
         *             "image_url": "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
         *             "image_width": 640,
         *             "image_height": 640,
         *             "link": {
         *                 "web_url": "http://www.daum.net",
         *                 "mobile_web_url": "http://m.daum.net",
         *                 "android_execution_params": "contentId=100",
         *                 "ios_execution_params": "contentId=100"
         *             }
         *         }
         */
      // 피드 템플릿으로 공유
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          // 채팅창에 보여질 제목
          title: '최봉석 ❤️ 김가율 결혼합니다',
          // 채팅창에 보여질 설명
          description: '2026년 3월 14일 토요일 오후 2시\n구미 토미스퀘어가든 4층',
          // 채팅창에 보여질 이미지 (중요: 절대경로 사용)
          image_url: imageUrl,
          image_width: 800,
          image_height: 1000,
          // 클릭 시 이동할 링크
          link: {
            web_url: baseUrl,
            mobile_web_url: baseUrl,
          },
        },
        // 공유 메시지 하단 버튼
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: baseUrl,
              webUrl: baseUrl,
            },
          },
        ],
        // 공유 완료 콜백
        success: function(response: any) {
          console.log('카카오톡 공유 성공:', response);
        },
        // 공유 실패 콜백
        fail: function(error: any) {
          console.error('카카오톡 공유 실패:', error);
          alert('공유 중 오류가 발생했습니다.');
        },
      });
    } catch (error) {
      console.error('공유 처리 중 오류:', error);
      alert('공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!isKakaoReady}
      title={isKakaoReady ? '카카오톡으로 공유' : '카카오톡 로딩 중...'}
      className={`fixed bottom-8 left-8 z-[60] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
        isKakaoReady
          ? 'bg-[#FEE500] text-[#3c1e1e] active:scale-95 hover:scale-110 cursor-pointer'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
      }`}
    >
      <i className="fa-solid fa-comment text-2xl"></i>
    </button>
  );
};

export default ShareButton;
