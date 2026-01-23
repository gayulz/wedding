import React, { useState } from 'react';
import RsvpManager from './RsvpManager';
import GuestbookManager from './GuestbookManager';

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'rsvp' | 'guestbook'>('rsvp');

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-[#1a1a1a] text-white font-mono flex flex-col">
            {/* Header / Tabs */}
            <div className="flex border-b border-white">
                <button
                    onClick={() => setActiveTab('rsvp')}
                    className={`flex-1 py-6 text-2xl md:text-4xl text-center transition-colors ${activeTab === 'rsvp'
                        ? 'text-[#fbbf24] font-bold'
                        : 'text-white/50 hover:text-white'
                        }`}
                >
                    RSVP 관리
                </button>
                <div className="w-[1px] bg-white mx-2 my-4"></div>
                <button
                    onClick={() => setActiveTab('guestbook')}
                    className={`flex-1 py-6 text-2xl md:text-4xl text-center transition-colors ${activeTab === 'guestbook'
                        ? 'text-[#fbbf24] font-bold'
                        : 'text-white/50 hover:text-white'
                        }`}
                >
                    방명록 관리
                </button>
            </div>

            {/* Logout Button (Small, Top Right absolute or in a separate bar if needed, but keeping it simple) */}
            <button
                onClick={onLogout}
                className="absolute top-4 right-4 text-xs text-gray-500 hover:text-white"
            >
                로그아웃
            </button>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-[#1a1a1a] p-4">
                {activeTab === 'rsvp' ? <RsvpManager /> : <GuestbookManager />}
            </div>
        </div>
    );
};

export default Dashboard;
