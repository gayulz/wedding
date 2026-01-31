import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePrivateInfo, PrivateInfo } from './usePrivateInfo';
import { createWeddingData } from '../data/content';

/**
 * [NEW] 웨딩 데이터 Context
 * 
 * 민감정보를 API에서 로드하여 전체 앱에 제공합니다.
 * 
 * @author gayul.kim
 * @since 2026-01-31
 */

// 웨딩 데이터 타입 (createWeddingData 반환 타입)
type WeddingData = ReturnType<typeof createWeddingData>;

interface WeddingDataContextType {
    weddingData: WeddingData;
    privateInfo: PrivateInfo | null;
    loading: boolean;
    error: Error | null;
}

const WeddingDataContext = createContext<WeddingDataContextType | null>(null);

interface WeddingDataProviderProps {
    children: ReactNode;
}

export const WeddingDataProvider: React.FC<WeddingDataProviderProps> = ({ children }) => {
    const { data: privateInfo, loading, error } = usePrivateInfo();
    const [weddingData, setWeddingData] = useState<WeddingData>(() => createWeddingData());

    // privateInfo가 로드되면 weddingData 업데이트
    useEffect(() => {
        if (privateInfo) {
            setWeddingData(createWeddingData({
                groom: privateInfo.groom,
                bride: privateInfo.bride,
                accounts: privateInfo.accounts
            }));
        }
    }, [privateInfo]);

    return (
        <WeddingDataContext.Provider value={{ weddingData, privateInfo, loading, error }}>
            {children}
        </WeddingDataContext.Provider>
    );
};

/**
 * 웨딩 데이터 사용 훅
 * 
 * @returns {WeddingDataContextType} 웨딩 데이터 및 로딩 상태
 */
export const useWeddingData = (): WeddingDataContextType => {
    const context = useContext(WeddingDataContext);
    if (!context) {
        throw new Error('useWeddingData must be used within a WeddingDataProvider');
    }
    return context;
};
