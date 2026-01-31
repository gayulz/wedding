import { useState, useEffect } from 'react';

/**
 * [NEW] 민감정보 API 호출 커스텀 훅
 * 
 * /api/private-info에서 개인정보를 가져옵니다.
 * 로딩 상태, 에러 처리, 캐싱을 지원합니다.
 * 
 * @author gayul.kim
 * @since 2026-01-31
 */

// API 응답 타입 정의
interface ParentInfo {
    name: string;
    phone: string;
}

interface PersonInfo {
    name: string;
    firstName: string;
    phone: string;
    parents: {
        mother?: ParentInfo;
        father?: ParentInfo;
        relation: string;
    };
}

interface AccountInfo {
    bank: string;
    name: string;
    num: string;
}

interface PrivateInfo {
    groom: PersonInfo;
    bride: PersonInfo;
    accounts: {
        groom: AccountInfo[];
        bride: AccountInfo[];
    };
    images: {
        hero: string;
        gallery: string[];
        closing: string;
    };
}

// 캐싱을 위한 전역 변수
let cachedData: PrivateInfo | null = null;
let fetchPromise: Promise<PrivateInfo> | null = null;

export function usePrivateInfo() {
    const [data, setData] = useState<PrivateInfo | null>(cachedData);
    const [loading, setLoading] = useState(!cachedData);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // 이미 캐시된 데이터가 있으면 사용
        if (cachedData) {
            setData(cachedData);
            setLoading(false);
            return;
        }

        // 이미 진행 중인 요청이 있으면 대기
        if (fetchPromise) {
            fetchPromise
                .then((result) => {
                    setData(result);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                    setLoading(false);
                });
            return;
        }

        // 새로운 요청 시작
        const fetchData = async (): Promise<PrivateInfo> => {
            // 로컬 개발 환경에서는 환경변수 직접 사용
            if (import.meta.env.DEV) {
                return {
                    groom: {
                        name: import.meta.env.VITE_GROOM_NAME || '신랑',
                        firstName: import.meta.env.VITE_GROOM_FIRST_NAME || '신랑',
                        phone: import.meta.env.VITE_GROOM_PHONE || '010-****-****',
                        parents: {
                            mother: {
                                name: import.meta.env.VITE_GROOM_MOTHER_NAME || '어머니',
                                phone: import.meta.env.VITE_GROOM_MOTHER_PHONE || '010-****-****'
                            },
                            relation: '아들'
                        }
                    },
                    bride: {
                        name: import.meta.env.VITE_BRIDE_NAME || '신부',
                        firstName: import.meta.env.VITE_BRIDE_FIRST_NAME || '신부',
                        phone: import.meta.env.VITE_BRIDE_PHONE || '010-****-****',
                        parents: {
                            father: {
                                name: import.meta.env.VITE_BRIDE_FATHER_NAME || '아버지',
                                phone: import.meta.env.VITE_BRIDE_FATHER_PHONE || '010-****-****'
                            },
                            relation: '딸'
                        }
                    },
                    accounts: {
                        groom: [
                            {
                                bank: import.meta.env.VITE_GROOM_MOTHER_BANK || '은행',
                                name: import.meta.env.VITE_GROOM_MOTHER_NAME || '어머니',
                                num: import.meta.env.VITE_GROOM_MOTHER_ACCOUNT || '****************'
                            },
                            {
                                bank: import.meta.env.VITE_GROOM_BANK || '은행',
                                name: import.meta.env.VITE_GROOM_NAME || '신랑',
                                num: import.meta.env.VITE_GROOM_ACCOUNT || '****************'
                            }
                        ],
                        bride: [
                            {
                                bank: import.meta.env.VITE_BRIDE_BANK || '은행',
                                name: import.meta.env.VITE_BRIDE_NAME || '신부',
                                num: import.meta.env.VITE_BRIDE_ACCOUNT || '****************'
                            }
                        ]
                    },
                    images: {
                        hero: import.meta.env.VITE_IMAGE_HERO || '',
                        gallery: [],
                        closing: import.meta.env.VITE_IMAGE_CLOSING || ''
                    }
                };
            }

            // 프로덕션 환경에서는 API 호출
            const response = await fetch('/api/private-info');
            if (!response.ok) {
                throw new Error('Failed to fetch private info');
            }
            return response.json();
        };

        fetchPromise = fetchData();

        fetchPromise
            .then((result) => {
                cachedData = result;
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            })
            .finally(() => {
                fetchPromise = null;
            });
    }, []);

    return { data, loading, error };
}

// 타입 export
export type { PrivateInfo, PersonInfo, AccountInfo };
