/**
 * [MIG] 이미지 로더 - Cloudinary URL 지원
 * 
 * 기존 Vite glob 방식에서 외부 URL 설정 파일 방식으로 변경.
 * 로컬 개발 시에도 Cloudinary URL을 사용합니다.
 * 
 * @author gayul.kim
 * @since 2026-01-31
 */

import { imageUrls } from '@/config/images';

/**
 * 파일 이름을 기반으로 이미지 URL을 반환합니다.
 * @param name 확장자를 제외한 이미지 파일 이름 (예: 'wedding-01')
 * @returns 이미지 URL. 찾지 못하면 빈 문자열을 반환합니다.
 */
export function loadImage(name: string): string {
    const url = imageUrls[name];
    if (!url) {
        console.warn(`Image with name "${name}" not found in config/images.ts`);
        return '';
    }
    return url;
}

/**
 * [NEW] 갤러리 이미지들을 백그라운드에서 미리 로드합니다.
 * Hero 애니메이션 동안 호출하여 갤러리 진입 시 이미지가 이미 캐시되어 있도록 합니다.
 * 
 * @author gayul.kim
 * @since 2026-01-29
 * @returns Promise<void> 모든 이미지 로드 완료 시 resolve
 */
export function preloadGalleryImages(): Promise<void> {
    const galleryImageNames = [
        'wedding-01', 'wedding-02', 'wedding-03', 'wedding-04',
        'wedding-05', 'wedding-06', 'wedding-07', 'wedding-08',
        'wedding-09', 'wedding-10', 'wedding-11', 'wedding-12',
        'wedding-13', 'wedding-14', 'wedding-15'
    ];

    const preloadPromises = galleryImageNames.map(name => {
        const src = loadImage(name);
        if (!src) return Promise.resolve();

        return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // 에러 시에도 계속 진행
            img.src = src;
        });
    });

    return Promise.all(preloadPromises).then(() => {
        console.log('[Preloader] Gallery images preloaded successfully');
    });
}
