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

        // [NEW] 데모 포트폴리오를 위한 더미 데이터 반환
        const fetchData = async (): Promise<PrivateInfo> => {
            return {
                groom: {
                    name: '김철수',
                    firstName: '철수',
                    phone: '010-1234-5678',
                    parents: {
                        mother: { name: '이영희', phone: '010-1111-2222' },
                        relation: '아들'
                    }
                },
                bride: {
                    name: '박지민',
                    firstName: '지민',
                    phone: '010-9876-5432',
                    parents: {
                        father: { name: '박기둥', phone: '010-3333-4444' },
                        relation: '딸'
                    }
                },
                accounts: {
                    groom: [
                        { bank: '우리은행', name: '이영희', num: '123-456-789012' },
                        { bank: '기업은행', name: '김철수', num: '987-654-321098' }
                    ],
                    bride: [
                        { bank: '카카오뱅크', name: '박지민', num: '3333-22-1111111' }
                    ]
                },
                images: {
                    hero: '',
                    gallery: [],
                    closing: ''
                }
            };
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
