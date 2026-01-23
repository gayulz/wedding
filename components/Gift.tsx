import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';
import { weddingData } from '@/data/content';

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
	const handleCopy = async () => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(account.num);
			} else {
				// Fallback for older browsers or non-HTTPS environments
				const textArea = document.createElement('textarea');
				textArea.value = account.num;
				textArea.style.position = 'fixed';
				textArea.style.left = '-9999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}
			showToast(weddingData.gift.toast);
		} catch (error) {
			console.error('Copy failed:', error);
			showToast('복사에 실패했습니다. 직접 복사해주세요.');
		}
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
				className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 interactive"
			>
				<i className="fa-regular fa-copy text-gray-600 text-xs"></i>
				<span className="text-xs text-gray-700 font-medium">{weddingData.gift.copyButton}</span>
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

	const groomAccounts = weddingData.gift.accounts.groom;
	const brideAccounts = weddingData.gift.accounts.bride;

	const currentAccounts = activeTab === 'groom' ? groomAccounts : brideAccounts;

	return (
		<div className="h-full w-full flex flex-col items-center bg-[#f8f8f8] px-8 pb-12 overflow-hidden">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				{/* 헤더 */}
				<div className="text-center pt-8 pb-10">
					<p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">{weddingData.gift.label}</p>
					<h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">{weddingData.gift.title}</h2>
					<div className="w-8 h-[1px] bg-gray-200 mx-auto mb-8"></div>
					<p className="text-[13px] font-gowoon text-gray-500 leading-relaxed whitespace-pre-line">
						{weddingData.gift.subtitle}
					</p>
				</div>

				{/* 탭 버튼 */}
				<div className="flex gap-2 mb-10 bg-gray-100/80 p-2 rounded-full">
					<button
						onClick={() => setActiveTab('groom')}
						className={`flex-1 py-3.5 rounded-full text-sm font-medium transition-all ${activeTab === 'groom'
							? 'bg-white text-gray-800 shadow-md'
							: 'text-gray-500'
							}`}
					>
						{weddingData.gift.tabs.groom}
					</button>
					<button
						onClick={() => setActiveTab('bride')}
						className={`flex-1 py-3.5 rounded-full text-sm font-medium transition-all ${activeTab === 'bride'
							? 'bg-white text-gray-800 shadow-md'
							: 'text-gray-500'
							}`}
					>
						{weddingData.gift.tabs.bride}
					</button>
				</div>

				{/* 계좌 카드 리스트 (상하 배치) */}
				<div className="flex flex-col gap-4 w-full">
					{currentAccounts.map((account, index) => (
						<motion.div
							key={`${activeTab}-${index}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							className="w-full"
						>
							<AccountCard account={account} showToast={showToast} />
						</motion.div>
					))}
				</div>
			</motion.div>

			<motion.p
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.5 }}
				className="mt-10 text-[11px] font-nanumsquare text-gray-400 text-center leading-relaxed whitespace-pre-line"
			>
				{weddingData.gift.footer}
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
