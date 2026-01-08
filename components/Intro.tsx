import React from 'react';
import {motion} from 'framer-motion';
// @ts-ignore
import wedding80 from '../images/wedding-80.png';

const Intro: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.25,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center px-8 text-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${wedding80})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-white/70"/>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative z-10 space-y-6 max-w-lg"
            >
                <motion.div variants={itemVariants} className="text-amber-600 font-medium mb-12">
                    INVITATION
                </motion.div>
                <motion.p variants={itemVariants} className="font-myeongjo text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    따뜻한 봄에 만난 우리,<br/>
                    오랜 시간 먼 길을 오가며 단단해진 사랑을 믿고<br/>
                    이제는 함께 걸어가려 합니다.
                </motion.p>
                <motion.p variants={itemVariants} className="font-myeongjo text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    봄에는 활짝 핀 벚꽃이 되어주고<br/>
                    여름에는 시원한 바람이 되어주겠습니다.<br/>
                    가을에는 드넓은 하늘이 되어주고<br/>
                    겨울에는 새하얀 눈이 되어<br/>
                    평생을 늘 서로에게 버팀목이 되어주겠습니다.
                </motion.p>
                <motion.p variants={itemVariants} className="font-myeongjo text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    시작의 한 걸음,<br/>
                    함께 축복해 주시면 감사드립니다.
                </motion.p>
                <motion.p variants={itemVariants} className="font-myeongjo text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    봉석 & 가율
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Intro;
