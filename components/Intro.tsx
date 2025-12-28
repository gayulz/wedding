
import React from 'react';
import { motion } from 'framer-motion';

const Intro: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fdfaf7] px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-lg"
      >
        <div className="text-amber-600 font-medium mb-12">INVITATION</div>
        <p className="font-myeongjo text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          따뜻한 봄에 만난 우리,<br/>
          오랜 시간 먼 길을 오가며 단단해진 사랑을 믿고<br/>
          이제는 함께 걸어가려 합니다.
        </p>
        <p className="font-myeongjo text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          봄에는 활짝 핀 벚꽃이 되어주고<br/>
          여름에는 시원한 바람이 되어주겠습니다.<br/>
          가을에는 드넓은 하늘이 되어주고<br/>
          겨울에는 새하얀 눈이 되어<br/>
          평생을 늘 서로에게 버팀목이 되어주겠습니다.
        </p>
        <p className="font-myeongjo text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          시작의 한 걸음,<br/>
          함께 축복해 주시면 감사드립니다.
        </p>
      </motion.div>
    </div>
  );
};

export default Intro;
