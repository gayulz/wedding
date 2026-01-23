import { useEffect, useRef, useCallback } from 'react';

/**
 * 모바일 뒤로가기 버튼 및 PC ESC 키를 제어하기 위한 훅
 * 모달이 열릴 때 history state를 추가하고, 뒤로가기/ESC 시 모달을 닫습니다.
 * 
 * @param isOpen 모달이 열려있는지 여부
 * @param onClose 모달 닫기 함수
 */
export const useModalBackHandler = (isOpen: boolean, onClose: () => void) => {
    const isPushedRef = useRef(false);
    const onCloseRef = useRef(onClose);

    // onClose 함수가 변경될 때마다 ref 업데이트
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // ESC 키 핸들러
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            onCloseRef.current();
        }
    }, []);

    // popstate 핸들러 (뒤로가기 버튼)
    const handlePopState = useCallback((e: PopStateEvent) => {
        // 모달이 열려있고 우리가 push한 state가 있을 때만 처리
        if (isPushedRef.current) {
            e.preventDefault();
            onCloseRef.current();
            isPushedRef.current = false;
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            // 모달이 열릴 때 history state 추가
            window.history.pushState({ modal: true, timestamp: Date.now() }, '');
            isPushedRef.current = true;

            // 이벤트 리스너 등록
            window.addEventListener('popstate', handlePopState);
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                // 이벤트 리스너 제거
                window.removeEventListener('popstate', handlePopState);
                window.removeEventListener('keydown', handleKeyDown);

                // 모달이 닫힐 때 (코드로 닫힐 때) history state가 남아있다면 제거
                // 단, 이미 popstate로 닫힌 경우는 제외
                if (isPushedRef.current) {
                    isPushedRef.current = false;
                    // 비동기로 처리하여 다른 이벤트 핸들러와 충돌 방지
                    // requestAnimationFrame으로 현재 이벤트 루프 완료 후 실행
                    requestAnimationFrame(() => {
                        window.history.back();
                    });
                }
            };
        }
    }, [isOpen, handlePopState, handleKeyDown]);
};
