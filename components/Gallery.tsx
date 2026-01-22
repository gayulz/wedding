import React, {useState, useEffect, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';

const Gallery: React.FC = () => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [dragConstraints, setDragConstraints] = useState(0);

    // 12개의 이미지 이름 배열
    const imageNames = [
        'wedding-01', 'wedding-02', 'wedding-03', 'wedding-04',
        'wedding-05', 'wedding-06', 'wedding-07', 'wedding-08',
        'wedding-09', 'wedding-10', 'wedding-11', 'wedding-12'
    ];

    const images = imageNames.map(name => loadImage(name));


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

    useEffect(() => {
        if (carouselRef.current) {
            const carouselWidth = carouselRef.current.offsetWidth;
            const contentWidth = carouselRef.current.scrollWidth;
            setDragConstraints(contentWidth - carouselWidth);
        }
    }, [imagesLoaded]);

    // 팝업에서 스크롤 이벤트가 부모로 전파되지 않도록 차단
    const handlePopupWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    };

    const handlePopupTouch = (e: React.TouchEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="h-full w-full flex flex-col items-center bg-white pt-12 px-6 pb-6 md:pt-12 md:px-12 md:pb-12 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
            >
                <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-0">GALLERY</p>
                <h2 className="text-2xl font-myeongjo text-gray-800 mt-0">소중한 순간들을 기록합니다</h2>
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
                     <motion.div
                         ref={carouselRef}
                         className="w-full overflow-hidden cursor-grab"
                         whileTap={{ cursor: 'grabbing' }}
                     >
                        <motion.div
                            className="flex gap-4"
                            drag="x"
                            dragConstraints={{ right: 0, left: -dragConstraints }}
                            dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
                        >
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className="flex-shrink-0 aspect-[3/4] rounded-lg shadow-lg overflow-hidden"
                                    style={{ width: '80vw', maxWidth: '400px' }}
                                >
                                    <img
                                        src={image}
                                        alt={`gallery-${index + 1}`}
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
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