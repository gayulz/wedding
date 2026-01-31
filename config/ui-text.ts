/**
 * [NEW] UI 텍스트 설정
 * 
 * 버튼, 라벨, 안내 문구 등 UI에 표시되는 텍스트를 관리합니다.
 * 다국어 지원 시 이 파일을 복제하여 사용합니다.
 * 
 * @author gayul.kim
 * @since 2026-01-31
 */

export const uiText = {
    hero: {
        label: "Wedding Invitation",
        scrollDown: "Scroll Down",
        connector: "💍"
    },

    intro: {
        label: "INVITATION",
        title: "소중한 분들을 초대합니다",
        contactButton: "연락하기",
        modal: {
            title: "연락하기",
            label: "CONTACT",
            groomSide: "신랑측",
            brideSide: "신부측",
            groomLabel: "GROOM",
            brideLabel: "BRIDE"
        }
    },

    profiles: {
        label: "INTERVIEW",
        title: "우리 두 사람의 이야기",
        subtitle: `결혼을 앞두고 저희 두 사람의
인터뷰를 준비했습니다.`,
        button: "어떤 배우자가 될까요 Q&A"
    },

    gallery: {
        label: "GALLERY",
        title: "소중한 순간들",
        subtitle: "저희의 아름다운 순간을 함께해주세요"
    },

    location: {
        label: "LOCATION",
        title: "오시는 길",
        venueTitle: "토미스퀘어가든",
        copyButton: "주소가 복사되었습니다.",
        navigation: {
            naver: "네이버",
            tmap: "티맵",
            kakao: "카카오"
        }
    },

    rsvp: {
        label: "RSVP",
        title: "참석 의사 전달하기",
        subtitle: "모든 분들을 소중히 모실 수 있도록 전해주세요",
        card: {
            connector: "♥",
            button: "참석 의사 체크하기"
        },
        form: {
            title: "참석 의사 체크하기",
            description: `한 분 한 분을 소중히 모실 수 있도록
참석 의사를 전해주시면 감사하겠습니다.`,
            side: {
                label: "어느 분의 하객이신가요?",
                groom: "신랑",
                bride: "신부"
            },
            attendance: {
                label: "참석하실 수 있나요?",
                yes: "참석할게요",
                no: "참석이 어려워요"
            },
            name: {
                label: "성함이 어떻게 되시나요?",
                placeholder: "참석자 본인 성함"
            },
            phone: {
                label: "동명이인 체크를 위한 번호를 알려주세요",
                placeholder: "핸드폰 번호 뒤 4자리"
            },
            submit: {
                default: "체크 완료하기",
                loading: "체크 중..."
            }
        },
        alert: {
            error: "오류가 발생했습니다.",
            allFields: "모든 항목을 입력해주세요."
        },
        success: {
            new: "제출되었습니다",
            update: "제출하신 내용을 수정했습니다",
            message: `소중한 의사 전달 감사합니다.
예식일에 뵙겠습니다.`,
            button: "닫기"
        }
    },

    gift: {
        label: "ACCOUNT",
        title: "마음 전하실 곳",
        subtitle: `참석이 어려우신 분들을 위해
계좌번호를 기재하였습니다.`,
        tabs: {
            groom: "신랑측",
            bride: "신부측"
        },
        copyButton: "복사하기",
        toast: "계좌번호가 복사되었습니다.",
        footer: `화훼 화환은 정중히 사양합니다.
보내주시는 따뜻한 마음 감사히 받겠습니다.`
    },

    guestbook: {
        label: "MESSAGE",
        title: "축하의 한마디",
        subtitle: "저희 둘에게 따뜻한 방명록을 남겨주세요",
        empty: "아직 작성된 방명록이 없습니다.",
        button: "메시지 남기기",
        loadMore: "더보기",
        fold: "접기",
        write: {
            title: "축하 메시지 작성하기",
            subtitle: "저희 둘의 결혼을 함께 축하해 주세요",
            placeholder: {
                name: "성함을 남겨주세요",
                password: "비밀번호를 입력해 주세요 (숫자 4자리)",
                message: "200자 이내로 작성해 주세요"
            },
            submit: {
                default: "작성 완료",
                loading: "작성 중..."
            }
        },
        password: {
            title: "비밀번호 확인",
            placeholder: "비밀번호 숫자 4자리",
            cancel: "취소",
            confirm: "확인"
        },
        edit: {
            title: "메시지 수정하기",
            submit: {
                default: "수정 완료",
                loading: "수정 중..."
            }
        },
        alert: {
            name: "이름을 입력해주세요.",
            password: "비밀번호는 4자리 숫자여야 합니다.",
            message: "메시지를 입력해주세요.",
            length: "메시지는 300자를 초과할 수 없습니다.",
            fail: "작업을 완료할 수 없습니다.",
            passwordMismatch: "비밀번호가 일치하지 않습니다."
        },
        success: {
            create: "축하 메시지가 전달되었습니다! 💕",
            update: "메시지가 수정되었습니다! ✏️"
        }
    },

    share: {
        kakao: {
            button: "청첩장 보기",
            alert: {
                error: "카카오톡 공유 기능을 사용할 수 없습니다. 페이지를 새로고침해주세요.",
                fail: "공유 중 오류가 발생했습니다."
            }
        }
    }
};
