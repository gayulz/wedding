import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, Timestamp } from 'firebase/firestore';

interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    createdAt: Timestamp;
}

const GuestbookManager: React.FC = () => {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState<GuestbookEntry | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, 'guestbook'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newEntries: GuestbookEntry[] = [];
            snapshot.forEach((doc) => {
                newEntries.push({
                    id: doc.id,
                    ...doc.data()
                } as GuestbookEntry);
            });
            setEntries(newEntries);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까? (복구 불가)')) {
            try {
                await deleteDoc(doc(db, 'guestbook', id));
                alert('삭제되었습니다.');
                setSelectedEntry(null);
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('삭제 실패');
            }
        }
    };

    if (loading) return <div className="text-center p-8 text-white">데이터 불러오는 중...</div>;

    return (
        <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white font-script">Guestbook ({entries.length})</h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-white border-collapse text-sm">
                    <thead>
                        <tr className="border-b-2 border-white bg-gray-800 text-gray-300">
                            <th className="p-3 text-center w-12 md:w-16">NO</th>
                            <th className="p-3 w-20 md:w-32 text-center">이름</th>
                            <th className="p-3 text-center">내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr
                                key={entry.id}
                                onClick={() => setSelectedEntry(entry)}
                                className="border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer active:bg-gray-700"
                            >
                                <td className="p-3 text-center">{entries.length - index}</td>
                                <td className="p-3 font-bold text-yellow-500 text-center">{entry.name}</td>
                                <td className="p-3 text-gray-300">
                                    {entry.message.length > 15
                                        ? entry.message.slice(0, 15) + '...'
                                        : entry.message}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {entries.length === 0 && (
                <div className="text-center py-10 text-gray-500">데이터가 없습니다.</div>
            )}

            {/* 상세 팝업 */}
            {selectedEntry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEntry(null)}>
                    <div className="bg-[#2a2a2a] text-white w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-6 relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedEntry(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
                        >
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">작성자</label>
                            <p className="text-xl font-bold text-yellow-500">{selectedEntry.name}</p>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">작성일시</label>
                            <p className="text-sm font-mono text-gray-400">
                                {selectedEntry.createdAt?.toDate().toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">내용</label>
                            <div className="bg-[#1a1a1a] p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap max-h-[40vh] overflow-y-auto border border-gray-700 break-all">
                                {selectedEntry.message}
                            </div>
                        </div>

                        <button
                            onClick={() => handleDelete(selectedEntry.id)}
                            className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/50 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-trash-can"></i>
                            삭제하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestbookManager;
