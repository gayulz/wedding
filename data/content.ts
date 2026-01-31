/**
 * [MIG] 청첩장 콘텐츠 데이터
 * 
 * 민감정보는 제거되었으며, API를 통해 로드됩니다.
 * 공개 가능한 정보는 config 파일에서 관리됩니다.
 * 
 * @author gayul.kim
 * @since 2026-01-31
 */

import { siteConfig, uiText } from '../config';

/**
 * 기본값 (API 로드 전 표시용)
 * 실제 값은 usePrivateInfo 훅을 통해 API에서 로드됩니다.
 */
const defaultPersonInfo = {
    groom: {
        name: "신랑",
        firstName: "신랑",
        phone: "010-****-****",
        parents: {
            mother: { name: "어머니", phone: "010-****-****" },
            relation: "아들"
        }
    },
    bride: {
        name: "신부",
        firstName: "신부",
        phone: "010-****-****",
        parents: {
            father: { name: "아버지", phone: "010-****-****" },
            relation: "딸"
        }
    }
};

const defaultAccounts = {
    groom: [
        { bank: '은행', name: '이름', num: '****************' },
        { bank: '은행', name: '이름', num: '****************' }
    ],
    bride: [
        { bank: '은행', name: '이름', num: '****************' }
    ]
};

/**
 * weddingData 생성 함수
 * privateInfo가 제공되면 실제 값 사용, 없으면 기본값 사용
 */
export const createWeddingData = (privateInfo?: {
    groom: typeof defaultPersonInfo.groom;
    bride: typeof defaultPersonInfo.bride;
    accounts: typeof defaultAccounts;
}) => {
    const personInfo = privateInfo || defaultPersonInfo;
    const accounts = privateInfo?.accounts || defaultAccounts;

    return {
        common: {
            groom: personInfo.groom,
            bride: personInfo.bride,
            date: siteConfig.date,
            location: siteConfig.location
        },
        opening: {
            text: siteConfig.greeting.opening
        },
        hero: {
            label: uiText.hero.label,
            scrollDown: uiText.hero.scrollDown,
            title: {
                groom: personInfo.groom.name,
                bride: personInfo.bride.name,
                connector: uiText.hero.connector
            }
        },
        intro: {
            label: uiText.intro.label,
            title: uiText.intro.title,
            mainText: siteConfig.greeting.main,
            contactButton: uiText.intro.contactButton,
            modal: uiText.intro.modal
        },
        profiles: {
            label: uiText.profiles.label,
            title: uiText.profiles.title,
            subtitle: uiText.profiles.subtitle,
            button: uiText.profiles.button,
            interviews: siteConfig.interviews
        },
        gallery: uiText.gallery,
        location: {
            label: uiText.location.label,
            title: uiText.location.title,
            venueTitle: uiText.location.venueTitle,
            copyButton: uiText.location.copyButton,
            navigation: uiText.location.navigation,
            transport: siteConfig.transport
        },
        rsvp: uiText.rsvp,
        gift: {
            ...uiText.gift,
            accounts: accounts
        },
        guestbook: uiText.guestbook,
        closing: {
            text: siteConfig.greeting.closing,
            image: 'wedding-81'
        },
        share: {
            kakao: {
                title: `${personInfo.groom.name} ❤️ ${personInfo.bride.name} 결혼식에 초대합니다`,
                description: `${siteConfig.date.full}
${siteConfig.location.name} ${siteConfig.location.hall}`,
                button: uiText.share.kakao.button,
                alert: uiText.share.kakao.alert
            }
        },
        footer: siteConfig.footer
    };
};

/**
 * 기본 weddingData (하위 호환성 유지)
 * 새로운 컴포넌트는 usePrivateInfo + createWeddingData 조합 사용 권장
 */
export const weddingData = createWeddingData();
