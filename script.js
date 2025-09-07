// D-day 계산
function calculateDday() {
    const weddingDate = new Date('2026-03-14');
    const today = new Date();
    const diffTime = weddingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const ddayElement = document.getElementById('dday');
    ddayElement.textContent = `D-${diffDays > 0 ? diffDays : 0}`;
}

// 페이드인 애니메이션
function observeElements() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.fade-section');
    sections.forEach((section) => observer.observe(section));
}

// 네이버 지도 열기
function openNaverMap() {
    const address = "경상북도 구미시 인동35길 46";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://map.naver.com/v5/search/${encodedAddress}`, '_blank');
}

// 카카오맵 열기
function openKakaoMap() {
    const address = "경상북도 구미시 인동35길 46";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://map.kakao.com/link/map/구미 토미스퀘어가든,36.09768151561699,128.43579320597706`, '_blank');
}

// 클립보드 복사
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            alert('계좌번호가 복사되었습니다.');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// 클립보드 복사 폴백
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        alert('계좌번호가 복사되었습니다.');
    } catch (err) {
        alert('복사에 실패했습니다. 직접 선택해서 복사해주세요.');
    }

    document.body.removeChild(textArea);
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    calculateDday();
    observeElements();
});