import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

const Gallery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // 12개의 이미지 배열
    const images = [
        '/images/wedding-01.png',
        '/images/wedding-02.png',
        '/images/wedding-03.png',
        '/images/wedding-04.png',
        '/images/wedding-05.png',
        '/images/wedding-06.png',
        '/images/wedding-07.png',
        '/images/wedding-08.png',
        '/images/wedding-09.png',
        '/images/wedding-10.png',
        '/images/wedding-11.png',
        '/images/wedding-12.png'
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

    // 팝업에서 스크롤 이벤트가 부모로 전파되지 않도록 차단
    const handlePopupWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    };

    const handlePopupTouch = (e: React.TouchEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-white p-6 md:p-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
            >
                <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2">GALLERY</p>
                <h2 className="text-2xl font-myeongjo text-gray-800">소중한 순간들을 기록합니다</h2>
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
                        {/* 이미지 캐러셀 */}
                        <div className="relative w-full h-[70vh] overflow-hidden">
                            <motion.div
                                className="flex gap-6 h-full pl-[10%]"
                                animate={{ x: `-${currentIndex * 94}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 flex items-center justify-center"
                                        style={{ width: '88%', aspectRatio: '3/4' }}
                                    >
                                        <img
                                            src={image}
                                            alt={`gallery-${index + 1}`}
                                            onClick={() => setSelectedImage(image)}
                                            className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer"
                                            draggable={false}
                                        />
                                    </div>
                                ))}
                            </motion.div>

                            {/* 터치 영역 */}
                            <div className="absolute inset-0 flex">
                                <div
                                    className="w-1/2 h-full cursor-pointer"
                                    onClick={() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length)}
                                />
                                <div
                                    className="w-1/2 h-full cursor-pointer"
                                    onClick={() => setCurrentIndex(prev => (prev + 1) % images.length)}
                                />
                            </div>
                        </div>

                        {/* 페이지 인디케이터 */}
                        <div className="flex items-center gap-2 mt-6">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
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

            {/* Image Popup */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        onWheel={handlePopupWheel}
                        onTouchMove={handlePopupTouch}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer bg-black/80"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-[90vw] max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                            onWheel={handlePopupWheel}
                            onTouchMove={handlePopupTouch}
                        >
                            <img
                                src={selectedImage}
                                alt="selected"
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
                        >
                            <i className="fa-solid fa-xmark text-4xl"></i>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
