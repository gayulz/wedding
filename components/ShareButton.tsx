import React, { useEffect, useState } from 'react';
import { weddingData } from '@/data/content';
import { uiText } from '@/config/ui-text';

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
            alert(weddingData.share.kakao.alert.error);
            return;
        }

        try {
            const baseUrl = window.location.origin;
            // 카카오톡 캐시 우회를 위한 버전 파라미터 추가
            const imageUrl = `https://wedding-gayul.netlify.app/images/wedding-02.jpg?v=2`;

            window.Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: weddingData.share.kakao.title,
                    description: weddingData.share.kakao.description,
                    imageUrl: imageUrl,
                    link: {
                        webUrl: baseUrl,
                        mobileWebUrl: baseUrl,
                    },
                },
                buttons: [
                    {
                        title: weddingData.share.kakao.button,
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
                    alert(weddingData.share.kakao.alert.fail);
                },
            });
        } catch (error) {
            console.error('공유 처리 중 오류:', error);
            alert(weddingData.share.kakao.alert.fail);
        }
    };

    return (
        <button
            onClick={handleShare}
            disabled={!isKakaoReady}
            title={isKakaoReady ? uiText.share.kakao.tooltip.ready : uiText.share.kakao.tooltip.loading}
            className={`absolute bottom-8 right-8 z-[60] w-12 h-12 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-300 border border-[#e8dfdf] ${isKakaoReady
                ? 'bg-[#ffffff]/90 backdrop-blur-sm text-[#5a4d4d] hover:bg-[#fffbf2] hover:text-[#3c1e1e] hover:border-[#d4c5c5] hover:scale-105 hover:shadow-[0_4px_25px_rgba(60,30,30,0.12)] cursor-pointer'
                : 'bg-gray-100/50 text-gray-300 cursor-not-allowed opacity-60'
                }`}
        >
            <i className="fa-solid fa-comment text-2xl"></i>
        </button>
    );
};

export default ShareButton;
