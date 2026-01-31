import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * [NEW] 민감정보 제공 Serverless API
 * 
 * 전화번호, 계좌번호, 이름 등 개인정보를 서버에서만 제공합니다.
 * 이 정보들은 환경변수로 관리되어 Git에 노출되지 않습니다.
 * 
 * @author gayul.kim
 * @since 2026-01-31
 */

// CORS 허용 도메인
const ALLOWED_ORIGINS = [
    'https://wedding-gayul.netlify.app',
    'https://wedding-gayul.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
];

export default function handler(req: VercelRequest, res: VercelResponse) {
    const origin = req.headers.origin || '';

    // CORS 설정
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET 요청만 허용
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 환경변수에서 민감정보 로드
    const privateInfo = {
        groom: {
            name: process.env.PRIVATE_GROOM_NAME || '신랑',
            firstName: process.env.PRIVATE_GROOM_FIRST_NAME || '신랑',
            phone: process.env.PRIVATE_GROOM_PHONE || '010-****-****',
            parents: {
                mother: {
                    name: process.env.PRIVATE_GROOM_MOTHER_NAME || '어머니',
                    phone: process.env.PRIVATE_GROOM_MOTHER_PHONE || '010-****-****'
                },
                relation: '아들'
            }
        },
        bride: {
            name: process.env.PRIVATE_BRIDE_NAME || '신부',
            firstName: process.env.PRIVATE_BRIDE_FIRST_NAME || '신부',
            phone: process.env.PRIVATE_BRIDE_PHONE || '010-****-****',
            parents: {
                father: {
                    name: process.env.PRIVATE_BRIDE_FATHER_NAME || '아버지',
                    phone: process.env.PRIVATE_BRIDE_FATHER_PHONE || '010-****-****'
                },
                relation: '딸'
            }
        },
        accounts: {
            groom: [
                {
                    bank: process.env.PRIVATE_GROOM_MOTHER_BANK || '은행',
                    name: process.env.PRIVATE_GROOM_MOTHER_NAME || '어머니',
                    num: process.env.PRIVATE_GROOM_MOTHER_ACCOUNT || '****************'
                },
                {
                    bank: process.env.PRIVATE_GROOM_BANK || '은행',
                    name: process.env.PRIVATE_GROOM_NAME || '신랑',
                    num: process.env.PRIVATE_GROOM_ACCOUNT || '****************'
                }
            ],
            bride: [
                {
                    bank: process.env.PRIVATE_BRIDE_BANK || '은행',
                    name: process.env.PRIVATE_BRIDE_NAME || '신부',
                    num: process.env.PRIVATE_BRIDE_ACCOUNT || '****************'
                }
            ]
        },
        images: {
            hero: process.env.PRIVATE_IMAGE_HERO || '',
            gallery: [
                process.env.PRIVATE_IMAGE_GALLERY_1 || '',
                process.env.PRIVATE_IMAGE_GALLERY_2 || '',
                process.env.PRIVATE_IMAGE_GALLERY_3 || '',
                process.env.PRIVATE_IMAGE_GALLERY_4 || '',
                process.env.PRIVATE_IMAGE_GALLERY_5 || '',
                process.env.PRIVATE_IMAGE_GALLERY_6 || '',
                process.env.PRIVATE_IMAGE_GALLERY_7 || '',
                process.env.PRIVATE_IMAGE_GALLERY_8 || '',
                process.env.PRIVATE_IMAGE_GALLERY_9 || '',
                process.env.PRIVATE_IMAGE_GALLERY_10 || ''
            ].filter(url => url !== ''),
            closing: process.env.PRIVATE_IMAGE_CLOSING || ''
        }
    };

    // 캐싱 헤더 (5분간 캐싱)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json(privateInfo);
}
