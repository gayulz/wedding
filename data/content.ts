export const weddingData = {
    common: {
        groom: {
            name: "최봉석",
            firstName: "봉석",
            phone: import.meta.env.VITE_GROOM_PHONE || "010-****-****",
            parents: {
                mother: { name: "석명순", phone: import.meta.env.VITE_GROOM_MOTHER_PHONE || "010-****-****" },
                relation: "아들"
            }
        },
        bride: {
            name: "김가율",
            firstName: "가율",
            phone: import.meta.env.VITE_BRIDE_PHONE || "010-****-****",
            parents: {
                father: { name: "김상준", phone: import.meta.env.VITE_BRIDE_FATHER_PHONE || "010-****-****" },
                relation: "딸"
            }
        },
        date: {
            full: "2026. 03. 14. 토 PM 2:00",
            year: "2026",
            month: "03",
            day: "14",
            weekDay: "토요일",
            time: "오후 2시"
        },
        location: {
            name: "구미 토미스퀘어가든",
            hall: "4층 스퀘어가든 홀",
            address: "경상북도 구미시 인동35길 46, 4층",
            addressShort: "경상북도 구미시 인동35길 46",
            tel: "054-473-6799"
        }
    },
    opening: {
        text: "봄날의 설렘, 저희 결혼합니다."
    },
    hero: {
        label: "Wedding Invitation",
        scrollDown: "Scroll Down",
        title: {
            groom: "최봉석",
            bride: "김가율",
            connector: "💍"
        }
    },
    intro: {
        label: "INVITATION",
        title: "소중한 분들을 초대합니다",
        mainText: `따뜻한 봄에 만난 우리,
오랜 시간 먼 길을 오가며 단단해진 사랑을 믿고
이제는 함께 걸어가려 합니다.

봄에는 활짝 핀 벚꽃이 되어주고
여름에는 시원한 바람이 되어주겠습니다.
가을에는 드넓은 하늘이 되어주고
겨울에는 새하얀 눈이 되어
평생을 늘 서로에게 버팀목이 되어주겠습니다.

시작의 한 걸음,
함께 축복해 주시면 감사드립니다.`,
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
        button: "어떤 배우자가 될까요 Q&A",
        interviews: [
            {
                question: "Q1. 결혼을 앞둔 소감",
                groom: `드디어 장가갑니다😊
평생 옆에 있고 싶은 사람을 만났습니다.
앞으로 더 잘해줄게요.
저희 잘 살겠습니다!
`,
                bride: `2020년 3월에 설레던 첫 만남이
2026년 3월에 인생의 동반자로 새로 시작합니다.
앞으로 더 잘하고 잘 살께요,지켜봐주세요❤️
`
            },
            {
                question: "Q2. 결혼을 결심한 계기는?",
                answer: `6년 사귀면서 싸워도 
결국 다시 찾게 되더라고요.
이 정도면 그냥 
평생 같이 살아야겠다 싶었습니다.
그리고 이 사람이랑 있으면 밥이 맛있어요🍚`
            },
            {
                question: "Q3. 서로 어떤 배우자가 될건가요?",
                groom: `설거지 잘하고, 무거운 거 잘 들고,
 빨래 개주는 남편 되겠습니다💪`,
                bride: `오빠 월급 안 건드리고 
검소한 아내 될게요💰
(단, 내 월급도 안 건드려야 함)`
            }
        ]
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
        },
        transport: {
            car: {
                title: "자가용",
                items: [
                    { label: "내비게이션", value: "'토미스퀘어가든' 또는 '인동35길 46' 검색" },
                    { label: "주차 안내", value: "건물 내 지하/지상 주차장 이용 (최대 1,400대)", subValue: "웨딩홀 방문객 무료 주차" }
                ]
            },
            bus: {
                title: "버스",
                items: [
                    { label: "시내버스", value: "인동정류장 하차 (도보 5분)" }
                ],
                routes: {
                    green: { label: "지선", value: "187, 187-1, 188" },
                    blue: { label: "간선", value: "180, 881, 881-1, 883, 883-1, 884, 884-1, 884-2, 885" }
                }
            },
            train: {
                title: "기차 (KTX/SRT)",
                items: [
                    { label: "구미역 (일반열차)", value: "구미역 하차 → 택시 이용 (약 15분 소요)", subValue: "또는 버스 환승 (인동 방면)" },
                    { label: "김천구미역 (KTX/SRT)", value: "김천구미역 하차 → 리무진 버스 또는 택시 이용", subValue: "(택시 이용 시 약 30~40분 소요)" }
                ]
            }
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
        accounts: {
            groom: [
                { bank: '우리은행', name: '석명순', num: import.meta.env.VITE_GROOM_MOTHER_ACCOUNT || '****************' },
                { bank: '기업은행', name: '최봉석', num: import.meta.env.VITE_GROOM_ACCOUNT || '****************' }
            ],
            bride: [
                { bank: '카카오뱅크', name: '김가율', num: import.meta.env.VITE_BRIDE_ACCOUNT || '****************' }
            ]
        },
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
    closing: {
        text: `응원하고 격려해주신 모든 분들께 감사드리며
행복하게 잘 살겠습니다.`,
        image: 'wedding-81'
    },
    share: {
        kakao: {
            title: "최봉석 ❤️ 김가율 결혼식에 초대합니다",
            description: `2026년 3월 14일 오후 2시
토미스퀘어가든 4층 스퀘어가든홀`,
            button: "청첩장 보기",
            alert: {
                error: "카카오톡 공유 기능을 사용할 수 없습니다. 페이지를 새로고침해주세요.",
                fail: "공유 중 오류가 발생했습니다."
            }
        }
    },
    footer: {
        name: "made by Gayul",
        copyright: `Copyright ⓒ 2026 All Rights Reserved.`
    }
};
