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
    // 갤러리 이미지 (wedding-01 ~ wedding-15)
    'wedding-01': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862799/f7wb6rvaihdarxgyvbqi.jpg',
    'wedding-02': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862799/lkepsx53vr5v8biltsa3.jpg',
    'wedding-03': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862800/frghxd2pc4bqtmkj6kbh.webp',
    'wedding-04': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862800/isook58gr4j9jo8o7trg.jpg',
    'wedding-05': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862800/lfmgujq52ort0vtxf9zw.webp',
    'wedding-06': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862800/htkbhdleswxtaiggmwvg.jpg',
    'wedding-07': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862801/ojfnrjcwrhndqbzb1pqz.jpg',
    'wedding-08': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862801/zfadfh75fgaumeaowaex.jpg',
    'wedding-09': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862802/cnp2ph0xamgwa6wzsxb9.webp',
    'wedding-10': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862802/p0xppbf2fkm5jzdvhkfc.webp',
    'wedding-11': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862802/ea3nw8ote3hvlicqauwc.webp',
    'wedding-12': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862803/ocyvqffamj7nq5i7kiqr.jpg',
    'wedding-13': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862803/h4eh2kycwsljxsc9k4jg.jpg',
    'wedding-14': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862803/hdcvqgw9srwkwokkints.webp',
    'wedding-15': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862804/xdycsyfqpbsyzubd3h1t.webp',

    // 특별 용도 이미지
    'wedding-81': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862805/chw6q39bispzzqbckcqs.webp',
    'wedding-98': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862806/wc6zoa5utofsceegolea.webp',
    'wedding-99': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862806/ysgfmydg7odhuyb5odbg.webp',
    'wedding-100': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862806/hijdd5ioyanirkyilbeo.jpg',
    'wedding-101': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862788/jvrvflklaxxle2cjkstq.webp',

    // 지도/네비게이션 아이콘
    'navermap': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862798/fb1eryzvitquqzhyt6gd.webp',
    'kakaonav': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862798/dlpysmc0dxdem3wzstyo.png',
    'tmap': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862799/unkmaoxvzuylibid2bdw.svg',

    // 은행 아이콘
    'webank': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862799/pwcwtfp3ezzid5meynn7.png',
    'ibkbank': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862798/zqyqaqwwgrsoccqjmtcj.svg',
    'kakaobank': 'https://res.cloudinary.com/my-wedding/image/upload/v1769862798/qcdvn6jbkw4laudneevy.jpg',
};
