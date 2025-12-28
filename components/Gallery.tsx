
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';

// wedding-01.jpeg ~ wedding-40.jpeg 이미지들을 import
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
import wedding13 from '../images/wedding-13.jpeg';
import wedding14 from '../images/wedding-14.jpeg';
import wedding15 from '../images/wedding-15.jpeg';
import wedding17 from '../images/wedding-17.jpeg';
import wedding18 from '../images/wedding-18.jpeg';
import wedding19 from '../images/wedding-19.jpeg';
import wedding20 from '../images/wedding-20.jpeg';
import wedding21 from '../images/wedding-21.jpeg';
import wedding22 from '../images/wedding-22.jpeg';
import wedding23 from '../images/wedding-23.jpeg';
import wedding24 from '../images/wedding-24.jpeg';
import wedding26 from '../images/wedding-26.jpeg';
import wedding27 from '../images/wedding-27.jpeg';
import wedding28 from '../images/wedding-28.jpeg';
import wedding29 from '../images/wedding-29.jpeg';
import wedding30 from '../images/wedding-30.jpeg';
import wedding31 from '../images/wedding-31.jpeg';
import wedding32 from '../images/wedding-32.jpeg';
import wedding33 from '../images/wedding-33.jpeg';
import wedding34 from '../images/wedding-34.jpeg';
import wedding35 from '../images/wedding-35.jpeg';
import wedding36 from '../images/wedding-36.jpeg';
import wedding37 from '../images/wedding-37.jpeg';
import wedding38 from '../images/wedding-38.jpeg';
import wedding39 from '../images/wedding-39.jpeg';
import wedding40 from '../images/wedding-40.jpeg';

const Gallery: React.FC = () => {
  const [page, setPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 모든 이미지를 배열에 담기
  const allImages = [
    wedding01, wedding02, wedding03, wedding04, wedding05,
    wedding06, wedding07, wedding08, wedding09, wedding10,
    wedding11, wedding12, wedding13, wedding14, wedding15,
    wedding17, wedding18, wedding19, wedding20, wedding21,
    wedding22, wedding23, wedding24, wedding26, wedding27,
    wedding28, wedding29, wedding30, wedding31, wedding32,
    wedding33, wedding34, wedding35, wedding36, wedding37,
    wedding38, wedding39, wedding40
  ];

  // 이미지를 순서대로 27개(3페이지) 사용
  const images = useMemo(() => {
    return allImages.slice(0, 27); // 랜덤 제거, 순서대로 27개
  }, []);

  const imagesPerPage = 9; // 페이지당 9개로 줄임
  const currentPageImages = images.slice(page * imagesPerPage, (page + 1) * imagesPerPage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  // Masonry breakpoint 설정 - 3열 고정
  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 3,
    500: 3
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white p-6 md:p-12">
      <div className="text-center mb-6">
        <h2 className="text-xl font-myeongjo text-gray-800 tracking-[0.2em]">GALLERY</h2>
        <div className="text-[10px] text-gray-400 mt-2">소중한 순간들을 기록합니다</div>
      </div>

      <div className="relative w-full max-w-xl flex flex-col" style={{ height: '550px' }}>
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: page === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: page === 0 ? 20 : -20 }}
            >
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-2 w-auto"
                columnClassName="pl-2 bg-clip-padding"
              >
                {currentPageImages.map((src, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="mb-2 bg-gray-100 overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => setSelectedImage(src)}
                  >
                    <img 
                      src={src} 
                      alt={`gallery-${idx}`} 
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                ))}
              </Masonry>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons - 고정 위치 */}
        <div className="flex justify-center gap-4 mt-4 flex-shrink-0">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
              page === 0 
                ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="flex items-center justify-center min-w-[60px] text-sm text-gray-600">
            {page + 1} / {totalPages}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
              page === totalPages - 1
                ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Lightbox - Liquid Glass Style */}
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
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl"
                />
              </div>
            </motion.div>
            <button 
              className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center liquid-glass hover:bg-white/30 transition-colors"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              <i className="fa-solid fa-xmark text-gray-700 text-2xl"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
