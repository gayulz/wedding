import { useEffect, useRef } from 'react';

/**
 * 모바일 뒤로가기 버튼을 제어하기 위한 훅
 * 모달이 열릴 때 history state를 추가하고, 뒤로가기 시 모달을 닫습니다.
 * 
 * @param isOpen 모달이 열려있는지 여부
 * @param onClose 모달 닫기 함수
 */
export const useModalBackHandler = (isOpen: boolean, onClose: () => void) => {
    const isPushedRef = useRef(false);

    useEffect(() => {
        if (isOpen) {
            // 모달이 열릴 때 history state 추가
            window.history.pushState({ modal: true }, '');
            isPushedRef.current = true;

            const handlePopState = () => {
                // 뒤로가기 버튼 클릭 시 모달 닫기
                onClose();
                // 이미 뒤로가기로 인해 state가 빠졌으므로 false로 설정
                isPushedRef.current = false;
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
                // 컴포넌트 언마운트 시(또는 모달이 코드로 닫힐 때) history state가 남아있다면 제거
                if (isPushedRef.current) {
                    window.history.back();
                    isPushedRef.current = false;
                }
            };
        }
    }, [isOpen, onClose]);
};
