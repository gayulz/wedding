import React from 'react';
import { motion } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';
import { weddingData } from '@/data/content';

const Closing: React.FC = () => {
    return (
        <section className="relative w-full h-[300px] overflow-hidden flex items-end justify-center bg-white-100 pb-10">
            {/* 배경 이미지 */}
            <div
                className="absolute inset-0"
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
                }}
            >
                <img
                    src={loadImage(weddingData.closing.image)}
                    alt="Closing"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            {/* 텍스트 오버레이 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10 text-center px-6"
            >
                <p className="text-gray-600 font-myeongjo text-sm md:text-lg leading-loose whitespace-pre-line drop-shadow-2xl">
                    {weddingData.closing.text}
                </p>
            </motion.div>
        </section>
    );
};

export default Closing;
