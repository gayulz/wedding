import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalBackHandler } from '@/hooks/useModalBackHandler';
import { loadImage } from '@/lib/image-loader.ts';
import { weddingData } from '@/data/content';

interface GalleryProps {
    onModalStateChange: (isOpen: boolean) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onModalStateChange }) => {
    // Removed imagesLoaded state as we will show immediately
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [dragConstraints, setDragConstraints] = useState(0);

    useModalBackHandler(!!selectedImage, () => setSelectedImage(null));

    // 17개의 이미지 이름 배열
    const imageNames = [
        'wedding-01', 'wedding-02', 'wedding-03', 'wedding-04',
        'wedding-05', 'wedding-06', 'wedding-07', 'wedding-08',
        'wedding-09', 'wedding-10', 'wedding-11', 'wedding-12',
        'wedding-13', 'wedding-14', 'wedding-15'
    ];

    const images = imageNames.map(name => loadImage(name));

    // Calculate constraints and handle resize
    useEffect(() => {
        const updateConstraints = () => {
            if (carouselRef.current) {
                const carouselWidth = carouselRef.current.offsetWidth;
                const contentWidth = carouselRef.current.scrollWidth;
                setDragConstraints(contentWidth - carouselWidth);
            }
        };

        // 초기 실행 및 약간의 지연 후 재실행 (이미지 렌더링 등 고려)
        updateConstraints();
        const timer = setTimeout(updateConstraints, 500);

        window.addEventListener('resize', updateConstraints);
        return () => {
            window.removeEventListener('resize', updateConstraints);
            clearTimeout(timer);
        };
    }, [images]); // images가 변경되면 재계산

    const [direction, setDirection] = useState(0);

    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                // opacity 제거: 깜빡임 방지
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            // opacity 제거
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                // opacity 제거
            };
        }
    };

    const showNextImage = () => {
        if (!selectedImage) return;
        setDirection(1);
        const currentIndex = images.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex]);
    };

    const showPrevImage = () => {
        if (!selectedImage) return;
        setDirection(-1);
        const currentIndex = images.indexOf(selectedImage);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedImage(images[prevIndex]);
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    // [MIG] 모달 오픈 시 배경 스크롤 잠금 및 부모에게 알림 (섹션 이동 방지)
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
            onModalStateChange(true);
        } else {
            document.body.style.overflow = '';
            onModalStateChange(false);
        }

        return () => {
            document.body.style.overflow = '';
            onModalStateChange(false);
        };
    }, [selectedImage, onModalStateChange]);

    // 팝업에서 스크롤 이벤트가 부모로 전파되지 않도록 차단
    const handlePopupWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    };

    const handlePopupTouch = (e: React.TouchEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="h-full w-full flex flex-col items-center bg-white px-6 pb-6 md:px-12 md:pb-12 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center pt-8 pb-10"
            >
                <p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">{weddingData.gallery.label}</p>
                <h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">{weddingData.gallery.title}</h2>
                <div className="w-8 h-[1px] bg-gray-200 mx-auto mb-6"></div>
                <p className="text-sm font-gowoon text-gray-500">{weddingData.gallery.subtitle}</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full max-w-4xl flex flex-col items-center min-h-[50vh] md:min-h-[600px]"
            >
                <motion.div
                    ref={carouselRef}
                    className="w-full overflow-hidden cursor-grab h-full py-4"
                    whileTap={{ cursor: 'grabbing' }}
                >
                    <motion.div
                        className="flex gap-4 h-full items-center"
                        drag="x"
                        dragConstraints={{ right: 0, left: -dragConstraints }}
                        dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
                        style={{
                            willChange: 'transform',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'translateZ(0)',
                            WebkitTransform: 'translateZ(0)'
                        }}
                    >
                        {images.map((image, index) => (
                            <div
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDirection(0);
                                    setSelectedImage(image);
                                }}
                                onTouchEnd={(e) => {
                                    e.stopPropagation();
                                }}
                                className="flex-shrink-0 aspect-[3/4] rounded-lg shadow-lg overflow-hidden bg-gray-100 interactive relative"
                                style={{ width: '80vw', maxWidth: '400px' }}
                            >
                                <img
                                    src={image}
                                    alt={`gallery-${index + 1}`}
                                    decoding="async"
                                    className="w-full h-full object-cover pointer-events-none"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)',
                                        WebkitTransform: 'translateZ(0)'
                                    }}
                                />
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Image Popup */}
            <AnimatePresence custom={direction}>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        onWheel={handlePopupWheel}
                        onTouchMove={handlePopupTouch}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    >
                        {/* 네비게이션 버튼 (PC/태블릿용) */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-20 p-4 transition-colors hidden md:block"
                            onClick={(e) => {
                                e.stopPropagation();
                                showPrevImage();
                            }}
                        >
                            <i className="fa-solid fa-chevron-left text-3xl"></i>
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-20 p-4 transition-colors hidden md:block"
                            onClick={(e) => {
                                e.stopPropagation();
                                showNextImage();
                            }}
                        >
                            <i className="fa-solid fa-chevron-right text-3xl"></i>
                        </button>

                        <div
                            className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                key={selectedImage}
                                src={selectedImage}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);

                                    if (swipe < -swipeConfidenceThreshold) {
                                        showNextImage();
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        showPrevImage();
                                    }
                                }}
                                className="max-w-[95vw] max-h-[85vh] md:max-w-[80vw] lg:max-w-4xl object-contain shadow-2xl"
                                alt="selected"
                                style={{
                                    willChange: 'transform',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                    transform: 'translateZ(0)',
                                    WebkitTransform: 'translateZ(0)',
                                    WebkitTouchCallout: 'none',
                                    WebkitUserSelect: 'none',
                                    userSelect: 'none'
                                }}
                            />
                        </div>

                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-20"
                        >
                            <i className="fa-solid fa-xmark text-3xl"></i>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;