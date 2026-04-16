/**
 * [NEW] 이미지 URL 설정 파일
 * 
 * Cloudinary 등 외부 호스팅된 이미지 URL을 관리합니다.
 * 템플릿 사용자는 이 파일의 URL을 자신의 이미지로 교체하면 됩니다.
 * 
 * @author gayul.kim
 * @since 2026-01-31
 */

export const imageUrls: Record<string, string> = {
    // [NEW] 데모 포트폴리오를 위한 생성형 AI 웨딩 일러스트
    // 갤러리 이미지 (wedding-01 ~ wedding-15)
    'wedding-01': '/demo-images/hero.png',
    'wedding-02': '/demo-images/gallery1.png',
    'wedding-03': '/demo-images/gallery2.png',
    'wedding-04': '/demo-images/gallery3.png',
    'wedding-05': '/demo-images/gallery4.png',
    'wedding-06': '/demo-images/gallery5.png',
    'wedding-07': '/demo-images/hero.png',
    'wedding-08': '/demo-images/gallery1.png',
    'wedding-09': '/demo-images/gallery2.png',
    'wedding-10': '/demo-images/gallery3.png',
    'wedding-11': '/demo-images/gallery4.png',
    'wedding-12': '/demo-images/gallery5.png',
    'wedding-13': '/demo-images/gallery1.png',
    'wedding-14': '/demo-images/gallery2.png',
    'wedding-15': '/demo-images/gallery3.png',

    // 특별 용도 이미지
    'wedding-81': '/demo-images/hero.png',
    'wedding-98': '/demo-images/gallery1.png',
    'wedding-99': '/demo-images/gallery2.png',
    'wedding-100': '/demo-images/gallery3.png',
    'wedding-101': '/demo-images/gallery4.png',

    // 지도/네비게이션 아이콘 (유지)
    'navermap': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862798/fb1eryzvitquqzhyt6gd.webp',
    'kakaonav': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862798/dlpysmc0dxdem3wzstyo.png',
    'tmap': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862799/unkmaoxvzuylibid2bdw.svg',

    // 은행 아이콘 (유지)
    'webank': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862799/pwcwtfp3ezzid5meynn7.png',
    'ibkbank': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862798/zqyqaqwwgrsoccqjmtcj.svg',
    'kakaobank': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862798/qcdvn6jbkw4laudneevy.jpg',
};
