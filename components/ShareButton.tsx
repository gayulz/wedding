import React, {useEffect, useState} from 'react';

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
                console.log('카카오 API 키 확인:', kakaoKey ? '존재함' : '없음');
                if (kakaoKey) {
                    window.Kakao.init(kakaoKey);
                    console.log('카카오 SDK 초기화 완료');
                    setIsKakaoReady(true);
                } else {
                    console.error('카카오 API 키가 없습니다.');
                }
            } else if (window.Kakao && window.Kakao.isInitialized()) {
                console.log('카카오 SDK 이미 초기화됨');
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
            // 카카오톡 캐시 우회를 위한 버전 파라미터 추가
            const imageUrl = `${baseUrl}/images/wedding-100.png?v=3`;

            window.Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: '최봉석 ❤️ 김가율 결혼식에 초대합니다',
                    description: '2026년 3월 14일 오후 2시\n토미스퀘어가든 4층 스퀘어가든홀',
                    imageUrl: imageUrl,
                    link: {
                        webUrl: baseUrl,
                        mobileWebUrl: baseUrl,
                    },
                },
                buttons: [
                    {
                        title: '청첩장 보기',
                        link: {
                            mobileWebUrl: baseUrl,
                            webUrl: baseUrl,
                        },
                    },
                ],
                success: function (response: any) {
                    console.log('카카오톡 공유 성공:', response);
                },
                fail: function (error: any) {
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
            className={`fixed bottom-8 right-24 z-[60] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
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
