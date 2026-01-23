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
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('삭제 실패');
            }
        }
    };

    if (loading) return <div className="text-center p-8 text-white">데이터 불러오는 중...</div>;

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-center text-white font-script">Guestbook ({entries.length})</h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-white border-collapse">
                    <thead>
                        <tr className="border-b-2 border-white">
                            <th className="p-4 text-xl">NO</th>
                            <th className="p-4 text-xl">이름</th>
                            <th className="p-4 text-xl w-1/2">내용</th>
                            <th className="p-4 text-xl text-center">삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                <td className="p-4">{entries.length - index}</td>
                                <td className="p-4 font-bold text-yellow-500">{entry.name}</td>
                                <td className="p-4 text-gray-300 break-all whitespace-pre-wrap text-sm leading-relaxed">
                                    {entry.message}
                                    <div className="text-[10px] text-gray-500 mt-1">
                                        {entry.createdAt?.toDate().toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="border border-red-500 text-red-500 w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all mx-auto"
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {entries.length === 0 && (
                <div className="text-center py-10 text-gray-500">데이터가 없습니다.</div>
            )}
        </div>
    );
};

export default GuestbookManager;
