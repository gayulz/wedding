import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, Timestamp } from 'firebase/firestore';

interface RsvpEntry {
    id: string;
    guest: string;      // '신랑' | '신부'
    guest_name: string;
    guest_phone: string;
    visited: boolean;   // true(참석) | false(불참)
    adult_count: number;
    child_count: number;
    timestamp: Timestamp;
}

const RsvpManager: React.FC = () => {
    const [entries, setEntries] = useState<RsvpEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterSide, setFilterSide] = useState<'all' | '신랑' | '신부'>('all');
    const [filterAtt, setFilterAtt] = useState<'all' | 'attend' | 'absent'>('all');

    useEffect(() => {
        const q = query(
            collection(db, 'rsvp'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newEntries: RsvpEntry[] = [];
            snapshot.forEach((doc) => {
                newEntries.push({
                    id: doc.id,
                    ...doc.data()
                } as RsvpEntry);
            });
            setEntries(newEntries);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까? (복구 불가)')) {
            try {
                await deleteDoc(doc(db, 'rsvp', id));
                alert('삭제되었습니다.');
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('삭제 실패');
            }
        }
    };

    // 필터링
    const filteredEntries = entries.filter(entry => {
        if (filterSide !== 'all' && entry.guest !== filterSide) return false;
        if (filterAtt !== 'all') {
            if (filterAtt === 'attend' && !entry.visited) return false;
            if (filterAtt === 'absent' && entry.visited) return false;
        }
        return true;
    });

    // 통계 계산 (필터링된 결과 기준 아님, 전체 기준 또는 선택된 탭 기준이 좋을듯? -> 여기선 전체 기준으로 보여주고 필터 결과도 따로 보여주는게 복잡하니, 필터된 결과의 합계를 보여줍시다)
    // 칠판 느낌이라 상단에 고정된 Total을 보여주는게 좋아보임.
    // 전체 통계
    const totalGroom = entries.filter(e => e.guest === '신랑' && e.visited).length; // 참석 명단 기준이 아니라 건수 기준? 인원 기준? 보통 인원수가 중요하니 인원수로 계산
    // 인원수 계산: (성인 + 아동)
    const totalPeopleGroom = entries
        .filter(e => e.guest === '신랑' && e.visited)
        .reduce((acc, curr) => acc + (curr.adult_count || 0) + (curr.child_count || 0), 0);

    const totalPeopleBride = entries
        .filter(e => e.guest === '신부' && e.visited)
        .reduce((acc, curr) => acc + (curr.adult_count || 0) + (curr.child_count || 0), 0);

    const totalPeople = totalPeopleGroom + totalPeopleBride;

    // 현재 리스트의 합계 (성인/아동)
    const currentListAdults = filteredEntries.reduce((acc, curr) => acc + (curr.adult_count || 0), 0);
    const currentListChildren = filteredEntries.reduce((acc, curr) => acc + (curr.child_count || 0), 0);

    if (loading) return <div className="text-center p-8 text-white">데이터 불러오는 중...</div>;

    return (
        <div className="w-full">
            {/* 상단 통계 카드 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-800 p-4 border border-gray-600 text-center">
                    <h3 className="text-gray-400 text-sm mb-1">총 합계</h3>
                    <p className="text-2xl font-bold text-white">{totalPeople}명</p>
                </div>
                <div className="bg-gray-800 p-4 border border-gray-600 text-center">
                    <h3 className="text-gray-400 text-sm mb-1">신랑측 참석</h3>
                    <p className="text-2xl font-bold text-blue-400">{totalPeopleGroom}명</p>
                </div>
                <div className="bg-gray-800 p-4 border border-gray-600 text-center">
                    <h3 className="text-gray-400 text-sm mb-1">신부측 참석</h3>
                    <p className="text-2xl font-bold text-pink-400">{totalPeopleBride}명</p>
                </div>
            </div>

            {/* 필터 */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-900 border border-gray-700 items-center">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">구분:</span>
                    <select
                        value={filterSide}
                        onChange={(e) => setFilterSide(e.target.value as any)}
                        className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
                    >
                        <option value="all">전체</option>
                        <option value="신랑">신랑측</option>
                        <option value="신부">신부측</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">참석여부:</span>
                    <select
                        value={filterAtt}
                        onChange={(e) => setFilterAtt(e.target.value as any)}
                        className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
                    >
                        <option value="all">전체</option>
                        <option value="attend">참석</option>
                        <option value="absent">불참</option>
                    </select>
                </div>
                <div className="ml-auto text-sm text-gray-400">
                    조회된 인원: 성인 {currentListAdults}명 / 아동 {currentListChildren}명
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-white border-collapse text-xs md:text-base">
                    <thead>
                        <tr className="border-b-2 border-white bg-gray-800 text-gray-300">
                            <th className="p-2 md:p-3 whitespace-nowrap text-center">NO</th>
                            <th className="p-2 md:p-3 whitespace-nowrap text-center">구분</th>
                            <th className="p-2 md:p-3 whitespace-nowrap text-center">참석</th>
                            <th className="p-2 md:p-3 whitespace-nowrap">이름</th>
                            <th className="p-2 md:p-3 whitespace-nowrap">연락처</th>
                            <th className="p-2 md:p-3 whitespace-nowrap text-center">성인</th>
                            <th className="p-2 md:p-3 whitespace-nowrap text-center">아동</th>
                            <th className="p-2 md:p-3 whitespace-nowrap text-center">삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEntries.map((entry, index) => (
                            <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                <td className="p-2 md:p-3 text-center">{filteredEntries.length - index}</td>
                                <td className="p-2 md:p-3 text-center">
                                    <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto ${entry.guest === '신랑' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.6)]'}`} title={entry.guest}></div>
                                </td>
                                <td className="p-2 md:p-3 text-center">
                                    <span className={`font-bold text-sm md:text-lg ${entry.visited ? 'text-green-400' : 'text-red-400'}`}>
                                        {entry.visited ? 'O' : 'X'}
                                    </span>
                                </td>
                                <td className="p-2 md:p-3 font-bold whitespace-nowrap">{entry.guest_name}</td>
                                <td className="p-2 md:p-3 font-mono text-gray-400 whitespace-nowrap">{entry.guest_phone}</td>
                                <td className="p-2 md:p-3 text-center">{entry.adult_count}</td>
                                <td className="p-2 md:p-3 text-center text-gray-400">{entry.child_count > 0 ? entry.child_count : '-'}</td>
                                <td className="p-2 md:p-3 text-center">
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="border border-red-500 text-red-500 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all mx-auto rounded"
                                    >
                                        <i className="fa-solid fa-xmark text-xs md:text-sm"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredEntries.length === 0 && (
                <div className="text-center py-10 text-gray-500">데이터가 없습니다.</div>
            )}
        </div>
    );
};

export default RsvpManager;
