import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Dashboard from './Dashboard';

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('bodmin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const adminDocRef = doc(db, 'bodmin', 'admin');
            const adminDoc = await getDoc(adminDocRef);

            if (adminDoc.exists()) {
                const data = adminDoc.data();
                if (data.id === id && data.pwd === pwd) {
                    setIsAuthenticated(true);
                    localStorage.setItem('bodmin_auth', 'true');
                } else {
                    setError('아이디 또는 비밀번호가 일치하지 않습니다.');
                }
            } else {
                setError('관리자 설정이 없습니다.');
            }
        } catch (err) {
            console.error(err);
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('bodmin_auth');
    };

    if (isAuthenticated) {
        return <Dashboard onLogout={handleLogout} />;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-[#1a1a1a] flex items-center justify-center p-4 font-mono text-white">
            <div className="w-full max-w-md">
                <h1 className="text-4xl text-center mb-12 font-script">관리자 페이지</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xl mb-2">ID</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full bg-transparent border-2 border-white p-3 text-lg outline-none focus:border-yellow-400 transition-colors rounded-none"
                            placeholder="아이디를 입력하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-xl mb-2">PW</label>
                        <input
                            type="password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            className="w-full bg-transparent border-2 border-white p-3 text-lg outline-none focus:border-yellow-400 transition-colors rounded-none"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border-2 border-white py-4 text-xl hover:bg-white hover:text-black transition-all mt-8 rounded-none"
                    >
                        {loading ? '확인 중...' : '로 그 인'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;
