import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';

declare global {
  interface Window {
    naver: any;
  }
}

const Location: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Main container ref for scroll logic
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll logic: Stop propagation if scrolling inside, allow if at boundaries
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrollDown = e.deltaY > 0;
      const isScrollUp = e.deltaY < 0;

      // Check boundaries with a small threshold
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      const isAtTop = scrollTop <= 0;

      if ((isScrollDown && !isAtBottom) || (isScrollUp && !isAtTop)) {
        e.stopPropagation(); // Scroll internally
      }
      // If at boundary, let it bubble up to App.tsx to switch section
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Store initial touch position if needed, but for simple scroll propagation 
      // standard behavior + stopPropagation on move usually works differently.
      // For simple scroll containers, preventing default is not what we want.
      // We want native scroll, just capturing the "overscroll" to switch sections.
      // Actually, for touch, we might rely on the natural scroll behavior.
      // But App.tsx handles touch gestures globally.

      // Strategy: If we are scrolling inside, stop propagation of the touch move 
      // so App.tsx doesn't trigger section switch.
      // BUT, App.tsx uses touch start/end delta.

      // Just stopping propagation on touch start/move/end if not at boundary might be tricky.
      // Simpler approach for touch: stop propagation of ALL touch events if not at boundary?
      // Let's try stopping propagation of touch end if we moved significantly internally.
    };

    // Easier approach matching App.tsx logic:
    // App.tsx uses wheel and touchstart/end.
    // We should stop propagation of these events if we consumed the scroll.

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);



  // ... Tmap handler code ...
  const handleTmapRoute = () => {
    // ... same code ...
    const destination = {
      name: '토미스퀘어가든',
      lat: 36.097854,
      lon: 128.435753
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const tmapAppUrl = `tmap://route?goalname=${encodeURIComponent(destination.name)}&goaly=${destination.lat}&goalx=${destination.lon}&starty=${latitude}&startx=${longitude}`;
          const tmapWebUrl = `https://apis.openapi.sk.com/tmap/app/routes?appKey=${import.meta.env.VITE_TMAP_API_KEY}&version=1&format=json&callback=result&goal=${destination.name}&goalY=${destination.lat}&goalX=${destination.lon}&startY=${latitude}&startX=${longitude}`;

          if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            window.location.href = tmapAppUrl;
            setTimeout(() => { window.open(tmapWebUrl, '_blank'); }, 2000);
          } else {
            window.open(tmapWebUrl, '_blank');
          }
        },
        (error) => {
          console.error('위치 권한 거부:', error);
          const tmapWebUrlNoStart = `https://apis.openapi.sk.com/tmap/app/routes?appKey=${import.meta.env.VITE_TMAP_API_KEY}&version=1&format=json&callback=result&goal=${destination.name}&goalY=${destination.lat}&goalX=${destination.lon}`;
          window.open(tmapWebUrlNoStart, '_blank');
        }
      );
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  };

  // ... initNaverMap code ...
  useEffect(() => {
    let mounted = true;
    const initNaverMap = () => {
      // ... same init code ...
      try {
        if (!mapRef.current) return;
        if (!window.naver || !window.naver.maps) return;

        const location = new window.naver.maps.LatLng(36.097854, 128.435753);
        const mapOptions = {
          center: location,
          zoom: 17,
          zoomControl: true,
          zoomControlOptions: { position: window.naver.maps.Position.TOP_RIGHT },
          scrollWheel: true,
          draggable: true,
          pinchZoom: true
        };
        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        new window.naver.maps.Marker({ position: location, map: map, title: '토미스퀘어가든' });

        if (mounted) { setMapLoaded(true); setError(null); }
      } catch (err) { }
    };

    let attempts = 0;
    const checkNaver = () => {
      attempts++;
      if (window.naver && window.naver.maps) initNaverMap();
      else if (attempts < 50) setTimeout(checkNaver, 100);
      else if (mounted) setError('네이버 지도를 로드하는데 시간이 초과되었습니다.');
    };
    const timer = setTimeout(checkNaver, 500);
    return () => { mounted = false; clearTimeout(timer); };
  }, []);


  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex flex-col items-center bg-[#f8f8f8] overflow-y-auto overflow-x-hidden no-scrollbar pb-12"
      // Stop touch propagation to prevent section switch when scrolling inside content
      onTouchStart={(e) => {
        // Stop propagation if we are inside content to prevent App swipe
        const container = containerRef.current;
        if (!container) return;
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 2;

        if (!isAtTop && !isAtBottom) {
          e.stopPropagation();
        }
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        const container = containerRef.current;
        if (!container) return;
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 2;

        if (!isAtTop && !isAtBottom) {
          e.stopPropagation();
        }
      }}
    >
      {/* 상단 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center pt-8 pb-10 px-6 shrink-0"
      >
        <p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">LOCATION</p>
        <h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">오시는 길</h2>
        <div className="w-8 h-[1px] bg-gray-200 mx-auto mb-8"></div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-lg font-gowoon text-gray-700">토미스퀘어가든</h3>
            <a href="tel:054-473-6799" className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <i className="fa-solid fa-phone text-xs"></i>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2">
            <p className="text-[13px] font-nanumsquare text-gray-500">경상북도 구미시 인동35길 46, 4층</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText("경상북도 구미시 인동35길 46");
                alert("주소가 복사되었습니다.");
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <i className="fa-regular fa-copy text-xs"></i>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 네이버 지도 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        ref={mapContainerRef}
        className="relative w-full overflow-hidden shrink-0"
        style={{ height: '270px' }}
      >
        <div ref={mapRef} className="w-full h-full bg-gray-200" />
        {!mapLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <i className="fa-solid fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
              <p className="text-xs text-gray-500">지도를 불러오는 중...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <i className="fa-solid fa-exclamation-triangle text-2xl text-yellow-500 mb-2"></i>
              <p className="text-xs text-gray-600">{error}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* 네비게이션 버튼 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 2, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full px-1 py-3 shrink-0"
      >
        <div className="grid grid-cols-3 gap-2">
          {/* ... Buttons (Naver, Tmap, Kakao) ... */}
          <a href="https://map.naver.com/p/search/토미스퀘어가든?c=15.00,0,0,0,dh" target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden"><img src={loadImage('navermap')} alt="네이버지도" className="w-full h-full object-cover" /></div>
            <span className="text-[11px] text-gray-700 font-medium">네이버</span>
          </a>
          <button onClick={handleTmapRoute} className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden"><img src={loadImage('tmap')} alt="티맵" className="w-full h-full object-cover" /></div>
            <span className="text-[11px] text-gray-700 font-medium">티맵</span>
          </button>
          <a href="https://map.kakao.com/link/map/토미스퀘어가든,36.097854,128.435753" target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden"><img src={loadImage('kakaonav')} alt="카카오내비" className="w-full h-full object-cover" /></div>
            <span className="text-[11px] text-gray-700 font-medium">카카오</span>
          </a>
        </div>
      </motion.div>

      {/* 교통편 섹션 (Merged from Transport.tsx) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-md space-y-8 px-8 py-8 shrink-0"
      >
        {/* 자가용 */}
        <motion.section variants={itemVariants} className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-car text-gray-800 text-lg"></i>
            <h3 className="text-base font-joseon text-gray-900 uppercase tracking-wider font-bold">자가용</h3>
          </div>
          <div className="space-y-6 font-nanumsquare">
            <div>
              <p className="text-sm text-gray-800 font-bold mb-1">내비게이션</p>
              <p className="text-sm text-gray-500">'토미스퀘어가든' 또는 '인동35길 46' 검색</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 font-bold mb-1">주차 안내</p>
              <p className="text-sm text-gray-500">건물 내 지하/지상 주차장 이용 (최대 1,400대)</p>
              <p className="text-sm text-gray-500">웨딩홀 방문객 무료 주차</p>
            </div>
          </div>
          <div className="border-b border-gray-100 mt-8"></div>
        </motion.section>

        {/* 버스 */}
        <motion.section variants={itemVariants} className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-bus text-gray-800 text-lg"></i>
            <h3 className="text-base font-joseon text-gray-900 uppercase tracking-wider font-bold">버스</h3>
          </div>
          <div className="space-y-6 font-nanumsquare">
            <div>
              <p className="text-sm text-gray-800 font-bold mb-1">시내버스</p>
              <p className="text-sm text-gray-500 mb-1">인동정류장 하차 (도보 5분)</p>
              <div className="text-xs text-gray-500 space-y-1 bg-white border border-gray-100 p-3 rounded-lg">
                <p><span className="text-green-600 font-medium font-bold">지선</span> 187, 187-1, 188</p>
                <p><span className="text-blue-600 font-medium font-bold">간선</span> 180, 881, 881-1, 883, 883-1, 884, 884-1, 884-2, 885</p>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-100 mt-8"></div>
        </motion.section>

        {/* 기차 (KTX/SRT) */}
        <motion.section variants={itemVariants} className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-train text-gray-800 text-lg"></i>
            <h3 className="text-base font-joseon text-gray-900 uppercase tracking-wider font-bold">기차 (KTX/SRT)</h3>
          </div>
          <div className="space-y-6 font-nanumsquare">
            <div>
              <p className="text-sm text-gray-800 font-bold mb-1">구미역 (일반열차)</p>
              <p className="text-sm text-gray-500">구미역 하차 → 택시 이용 (약 15분 소요)</p>
              <p className="text-sm text-gray-500 mt-1">또는 버스 환승 (인동 방면)</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 font-bold mb-1">김천구미역 (KTX/SRT)</p>
              <p className="text-sm text-gray-500">김천구미역 하차 → 리무진 버스 또는 택시 이용</p>
              <p className="text-xs text-gray-500 mt-1">(택시 이용 시 약 30~40분 소요)</p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Location;