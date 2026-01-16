/**
 * Vite의 glob 기능을 사용하여 images 폴더의 모든 이미지를 동적으로 가져옵니다.
 * 이 모듈을 사용하면 확장자 없이 파일 이름만으로 이미지 경로를 얻을 수 있습니다.
 */

// eager: true 옵션으로 모든 이미지 모듈을 즉시 로드합니다.
const imageModules = import.meta.glob('@/images/**/*.{png,jpg,jpeg,svg,webp}', { eager: true });

// '파일이름': '실제경로' 형태의 맵을 생성합니다.
const images: Record<string, string> = {};

for (const path in imageModules) {
    // 모듈에서 기본 내보내기(이미지 경로)를 가져옵니다.
    const mod = imageModules[path] as { default: string };
    
    // 경로에서 파일 이름(확장자 제외)을 추출합니다. 예: 'wedding-01'
    const filename = path.split('/').pop()?.replace(/\.\w+$/, '');

    if (filename) {
        // 동일한 파일 이름(확장자만 다름)이 여러 개 있을 경우, 하나만 등록합니다.
        // webp, png, jpg 순서 등으로 우선순위를 정할 수도 있지만, 여기서는 먼저 찾은 것을 사용합니다.
        if (!images[filename]) {
            images[filename] = mod.default;
        }
    }
}

/**
 * 파일 이름을 기반으로 Vite에서 처리된 실제 이미지 경로를 반환합니다.
 * @param name 확장자를 제외한 이미지 파일 이름 (예: 'wedding-01')
 * @returns 처리된 이미지 경로. 이미지를 찾지 못하면 빈 문자열을 반환합니다.
 */
export function loadImage(name: string): string {
    if (!images[name]) {
        console.warn(`Image with name "${name}" not found.`);
        return '';
    }
    return images[name];
}
