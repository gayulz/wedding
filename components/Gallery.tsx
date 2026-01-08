import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

// 12개의 이미지만 import
import wedding01 from '../images/wedding-01.jpeg';
import wedding02 from '../images/wedding-02.jpeg';
import wedding03 from '../images/wedding-03.jpeg';
import wedding04 from '../images/wedding-04.jpeg';
import wedding05 from '../images/wedding-05.jpeg';
import wedding06 from '../images/wedding-06.jpeg';
import wedding07 from '../images/wedding-07.jpeg';
import wedding08 from '../images/wedding-08.jpeg';
import wedding09 from '../images/wedding-09.jpeg';
import wedding10 from '../images/wedding-10.jpeg';
import wedding11 from '../images/wedding-11.jpeg';
import wedding12 from '../images/wedding-12.jpeg';


const Gallery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // 12개의 이미지 배열
    const images = [
        wedding01, wedding02, wedding03, wedding04, wedding05, wedding06,
        wedding07, wedding08, wedding09, wedding10, wedding11, wedding12
    ];

    // 이미지 프리로드
    useEffect(() => {
        const preloadImage = (src: string) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
            });
        };

        Promise.all(images.map(src => preloadImage(src)))
            .then(() => {
                setImagesLoaded(true);
            })
            .catch(err => {
                console.error('Image preload error:', err);
                setImagesLoaded(true);
            });
    }, []);

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleDragEnd = (_e: any, { offset, velocity }: any) => {
        const swipe = Math.abs(offset.x) * velocity.x;

        if (swipe < -10000) {
            handleNext();
        } else if (swipe > 10000) {
            handlePrev();
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0
        })
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-white p-6 md:p-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
            >
                <h2 className="text-xl font-myeongjo text-gray-800 tracking-[0.2em]">GALLERY</h2>
                <div className="text-[10px] text-gray-400 mt-2">소중한 순간들을 기록합니다</div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full max-w-4xl flex flex-col items-center"
            >
                {!imagesLoaded ? (
                    // 로딩 중 표시
                    <div className="h-[70vh] flex items-center justify-center">
                        <div className="text-center">
                            <i className="fa-solid fa-spinner fa-spin text-3xl text-gray-400 mb-3"></i>
                            <p className="text-sm text-gray-500">사진을 불러오는 중...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 이미지 슬라이드 */}
                        <div className="relative w-full h-[70vh] overflow-hidden rounded-lg">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={handleDragEnd}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <img
                                        src={images[currentIndex]}
                                        alt={`gallery-${currentIndex + 1}`}
                                        onClick={() => setSelectedImage(images[currentIndex])}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* 좌우 네비게이션 버튼 */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg transition-all z-10"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg transition-all z-10"
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>

                        {/* 페이지 인디케이터 */}
                        <div className="flex items-center gap-2 mt-6">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 1 : -1);
                                        setCurrentIndex(index);
                                    }}
                                    className={`transition-all ${
                                        index === currentIndex
                                            ? 'w-8 h-2 bg-gray-800'
                                            : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                    } rounded-full`}
                                />
                            ))}
                        </div>

                        {/* 카운터 */}
                        <div className="text-sm text-gray-600 mt-3">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </motion.div>

            {/* Image Popup - Liquid Glass Style */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 200, 0.05))',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="liquid-glass p-4 rounded-3xl shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                }}
                            >
                                <img
                                    src={selectedImage}
                                    alt="selected"
                                    className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                                />
                            </div>
                        </motion.div>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                            style={{
                                background: 'rgba(0, 0, 0, 0.7)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                            }}
                        >
                            <i className="fa-solid fa-xmark text-white text-2xl"></i>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
