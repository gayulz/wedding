import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { loadImage } from '@/lib/image-loader.ts';
import { weddingData } from '@/data/content';
import { uiText } from '@/config/ui-text';

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
  const [copySuccess, setCopySuccess] = useState(false);

  // 네이버 지도 SDK 동적 로딩
  useEffect(() => {
    if (window.naver && window.naver.maps) return;

    // 환경변수가 없으면 하드코딩된 키(tmyfa04oa3) 사용 (안전장치)
    const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || 'tmyfa04oa3';

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

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

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);



  // ... Tmap handler code ...
  const handleTmapRoute = () => {
    const destination = {
      name: uiText.location.venueTitle,
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
          console.error(uiText.location.map.locationDenied, error);
          const tmapWebUrlNoStart = `https://apis.openapi.sk.com/tmap/app/routes?appKey=${import.meta.env.VITE_TMAP_API_KEY}&version=1&format=json&callback=result&goal=${destination.name}&goalY=${destination.lat}&goalX=${destination.lon}`;
          window.open(tmapWebUrlNoStart, '_blank');
        }
      );
    } else {
      alert(uiText.location.map.browserNotSupported);
    }
  };

  // ... initNaverMap code ...
  useEffect(() => {
    let mounted = true;
    const initNaverMap = () => {
      try {
        if (!mapRef.current) return;
        if (!window.naver || !window.naver.maps) return;

        const location = new window.naver.maps.LatLng(36.097854, 128.435753);
        const mapOptions = {
          center: location,
          zoom: 17,
          zoomControl: false,
          zoomControlOptions: { position: window.naver.maps.Position.TOP_RIGHT },
          scrollWheel: false,
          draggable: false,
          pinchZoom: true
        };
        const map = new window.naver.maps.Map(mapRef.current, mapOptions);

        const contentString = [
          '<div style="padding:10px;min-width:200px;line-height:150%;">',
          `<h4 style="margin-top:5px;">${weddingData.common.location.name}</h4>`,
          `<p>${weddingData.common.location.addressShort}<br />`,
          `  <span style="color:#555;font-size:13px;">${weddingData.common.location.tel}</span>`,
          '</p>',
          '</div>'
        ].join('');

        const marker = new window.naver.maps.Marker({ position: location, map: map, title: weddingData.common.location.name });

        const infowindow = new window.naver.maps.InfoWindow({
          content: contentString,
          maxWidth: 300,
          backgroundColor: "#fff",
          borderColor: "#ccc",
          borderWidth: 1,
          anchorSize: new window.naver.maps.Size(10, 10),
          anchorSkew: true,
          anchorColor: "#fff",
          pixelOffset: new window.naver.maps.Point(20, -20)
        });

        window.naver.maps.Event.addListener(marker, "click", function () {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.open(map, marker);
          }
        });

        if (mounted) { setMapLoaded(true); setError(null); }
      } catch (err) { }
    };

    let attempts = 0;
    const checkNaver = () => {
      attempts++;
      if (window.naver && window.naver.maps) initNaverMap();
      else if (attempts < 50) setTimeout(checkNaver, 100);
      else if (mounted) setError(uiText.location.map.timeout);
    };
    const timer = setTimeout(checkNaver, 500);
    return () => { mounted = false; clearTimeout(timer); };
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(weddingData.common.location.address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy info: ', err);
    }
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
  };

  const { transport } = weddingData.location;

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
        <p className="text-[10px] font-joseon text-gray-400 tracking-[0.4em] uppercase mb-1">{weddingData.location.label}</p>
        <h2 className="text-2xl font-myeongjo text-gray-800 mb-6 leading-tight">{weddingData.location.title}</h2>
        <div className="w-8 h-[1px] bg-gray-200 mx-auto mb-8"></div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-lg font-gowoon text-gray-700">{weddingData.common.location.name}</h3>
            <a href={`tel:${weddingData.common.location.tel}`} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <i className="fa-solid fa-phone text-xs"></i>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2">
            <p className="text-[13px] font-nanumsquare text-gray-500">{weddingData.common.location.address}</p>
            <button
              onClick={handleCopyAddress}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {copySuccess ? (
                <i className="fa-solid fa-check text-green-500 text-xs"></i>
              ) : (
                <i className="fa-regular fa-copy text-xs"></i>
              )}
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
              <p className="text-xs text-gray-500">{uiText.location.map.loading}</p>
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
          <a href={`https://map.naver.com/p/search/${encodeURIComponent(uiText.location.venueTitle)}?c=15.00,0,0,0,dh`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden"><img src={loadImage('navermap')} alt="네이버지도" className="w-full h-full object-cover" /></div>
            <span className="text-[11px] text-gray-700 font-medium">{weddingData.location.navigation.naver}</span>
          </a>
          <button onClick={handleTmapRoute} className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden"><img src={loadImage('tmap')} alt="티맵" className="w-full h-full object-cover" /></div>
            <span className="text-[11px] text-gray-700 font-medium">{weddingData.location.navigation.tmap}</span>
          </button>
          <a href={`https://map.kakao.com/link/map/${encodeURIComponent(uiText.location.venueTitle)},36.097854,128.435753`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden"><img src={loadImage('kakaonav')} alt="카카오내비" className="w-full h-full object-cover" /></div>
            <span className="text-[11px] text-gray-700 font-medium">{weddingData.location.navigation.kakao}</span>
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
            <h3 className="text-base font-joseon text-gray-900 uppercase tracking-wider font-bold">{transport.car.title}</h3>
          </div>
          <div className="space-y-6 font-nanumsquare">
            {transport.car.items.map((item, idx) => (
              <div key={idx}>
                <p className="text-sm text-gray-800 font-bold mb-1">{item.label}</p>
                <p className="text-sm text-gray-500">{item.value}</p>
                {item.subValue && <p className="text-sm text-gray-500">{item.subValue}</p>}
              </div>
            ))}
          </div>
          <div className="border-b border-gray-100 mt-8"></div>
        </motion.section>

        {/* 버스 */}
        <motion.section variants={itemVariants} className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-bus text-gray-800 text-lg"></i>
            <h3 className="text-base font-joseon text-gray-900 uppercase tracking-wider font-bold">{transport.bus.title}</h3>
          </div>
          <div className="space-y-6 font-nanumsquare">
            {transport.bus.items.map((item, idx) => (
              <div key={idx}>
                <p className="text-sm text-gray-800 font-bold mb-1">{item.label}</p>
                <p className="text-sm text-gray-500 mb-1">{item.value}</p>
              </div>
            ))}
            {transport.bus.routes && (
              <div className="text-xs text-gray-500 space-y-1 bg-white border border-gray-100 p-3 rounded-lg">
                <p><span className="text-green-600 font-medium font-bold">{transport.bus.routes.green.label}</span> {transport.bus.routes.green.value}</p>
                <p><span className="text-blue-600 font-medium font-bold">{transport.bus.routes.blue.label}</span> {transport.bus.routes.blue.value}</p>
              </div>
            )}
          </div>
          <div className="border-b border-gray-100 mt-8"></div>
        </motion.section>

        {/* 기차 (KTX/SRT) */}
        <motion.section variants={itemVariants} className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-train text-gray-800 text-lg"></i>
            <h3 className="text-base font-joseon text-gray-900 uppercase tracking-wider font-bold">{transport.train.title}</h3>
          </div>
          <div className="space-y-6 font-nanumsquare">
            {transport.train.items.map((item, idx) => (
              <div key={idx}>
                <p className="text-sm text-gray-800 font-bold mb-1">{item.label}</p>
                <p className="text-sm text-gray-500">{item.value}</p>
                {item.subValue && <p className="text-sm text-gray-500 mt-1">{item.subValue}</p>}
              </div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Location;