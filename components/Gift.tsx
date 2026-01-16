import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';

interface Account {
	name: string;
	bank: string;
	num: string;
}

const getBankIcon = (bankName: string): string => {
	if (bankName.includes('우리')) return loadImage('webank');
	if (bankName.includes('기업')) return loadImage('ibkbank');
	if (bankName.includes('카카오')) return loadImage('kakaobank');
	return '';
};

const AccountCard: React.FC<{
	account: Account;
	showToast: (message: string) => void;
}> = ({ account, showToast }) => {
	const handleCopy = () => {
		navigator.clipboard.writeText(account.num);
		showToast('계좌번호가 복사되었습니다.');
	};

	const bankIcon = getBankIcon(account.bank);

	return (
		<div className="min-w-full bg-white rounded-3xl p-6 shadow-md border border-gray-100/50">
			{/* 이름 */}
			<div className="text-center mb-5">
				<p className="text-base font-medium text-gray-800">{account.name}</p>
			</div>

			{/* 은행명 + 계좌번호 */}
			<div className="flex items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2">
					{bankIcon && (
						<img
							src={bankIcon}
							alt={account.bank}
							className="w-5 h-5 object-contain rounded"
						/>
					)}
					<span className="text-xs text-gray-700 font-medium">{account.bank}</span>
				</div>
				<span className="font-mono text-xs text-gray-700">{account.num}</span>
			</div>

			{/* 복사하기 버튼 */}
			<button
				onClick={handleCopy}
				className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
			>
				<i className="fa-regular fa-copy text-gray-600 text-xs"></i>
				<span className="text-xs text-gray-700 font-medium">복사하기</span>
			</button>
		</div>
	);
};

const Gift: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
	const [toast, setToast] = useState({ show: false, message: '' });

	const showToast = (message: string) => {
		setToast({ show: true, message });
		setTimeout(() => {
			setToast({ show: false, message: '' });
		}, 2000);
	};

	const groomAccounts: Account[] = [
		{ bank: '우리은행', name: '석명순', num: '70820187102001' },
		{ bank: '기업은행', name: '최봉석', num: '01044041519' }
	];

	const brideAccounts: Account[] = [
		{ bank: '카카오뱅크', name: '김가율', num: '3333326228606' }
	];

	const currentAccounts = activeTab === 'groom' ? groomAccounts : brideAccounts;

	return (
		<div className="h-full w-full flex flex-col items-center justify-center bg-[#f8f8f8] p-8 overflow-hidden">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				{/* 헤더 */}
				<div className="text-center mb-10">
					<p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-3">ACCOUNT</p>
					<h2 className="text-2xl font-myeongjo text-gray-800 mb-6">마음 전하실 곳</h2>
					<p className="text-xs text-gray-500 leading-relaxed">
						참석이 어려우신 분들을 위해<br />
						계좌번호를 기재하였습니다.<br />
						너그러운 마음으로 양해 부탁드립니다.
					</p>
				</div>

				{/* 탭 버튼 */}
				<div className="flex gap-2 mb-10 bg-gray-100/80 p-2 rounded-full">
					<button
						onClick={() => setActiveTab('groom')}
						className={`flex-1 py-3.5 rounded-full text-sm font-medium transition-all ${
							activeTab === 'groom'
								? 'bg-white text-gray-800 shadow-md'
								: 'text-gray-500'
						}`}
					>
						신랑측
					</button>
					<button
						onClick={() => setActiveTab('bride')}
						className={`flex-1 py-3.5 rounded-full text-sm font-medium transition-all ${
							activeTab === 'bride'
								? 'bg-white text-gray-800 shadow-md'
								: 'text-gray-500'
						}`}
					>
						신부측
					</button>
				</div>

				{/* 계좌 카드 슬라이드 */}
				<div className="relative -mx-8 px-8">
					<div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
						<div className={`flex gap-4 pb-2 ${currentAccounts.length === 1 ? 'justify-center' : ''}`}>
							{currentAccounts.map((account, index) => (
								<motion.div
									key={`${activeTab}-${index}`}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
									className="snap-start flex-shrink-0"
									style={{ width: 'calc(100% - 3rem)' }}
								>
									<AccountCard account={account} showToast={showToast} />
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</motion.div>

			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.8 }}
				className="mt-10 text-xs text-gray-400 text-center leading-relaxed"
			>
				화훼 화환은 정중히 사양합니다.<br />
				보내주시는 따뜻한 마음 감사히 받겠습니다.
			</motion.p>

			{/* Toast Popup */}
			<AnimatePresence>
				{toast.show && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.3 }}
						className="fixed bottom-16 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-lg"
						style={{
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							backdropFilter: 'blur(10px)',
							WebkitBackdropFilter: 'blur(10px)',
						}}
					>
						<p className="text-white text-sm">{toast.message}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Gift;
