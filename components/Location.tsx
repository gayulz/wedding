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
  const mapContainerRef = useRef<HTMLDivElement>(null); // 지도 영역 페이지 전환 방지용
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // T맵 경로안내 핸들러
  const handleTmapRoute = () => {
    const destination = {
      name: '토미스퀘어가든',
      lat: 36.097854,
      lon: 128.435753
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // T맵 앱 딥링크 (모바일 앱 실행)
          const tmapAppUrl = `tmap://route?goalname=${encodeURIComponent(destination.name)}&goaly=${destination.lat}&goalx=${destination.lon}&starty=${latitude}&startx=${longitude}`;

          // T맵 웹 경로안내 (앱 미설치 시 대체)
          const tmapWebUrl = `https://apis.openapi.sk.com/tmap/app/routes?appKey=${import.meta.env.VITE_TMAP_API_KEY}&version=1&format=json&callback=result&goal=${destination.name}&goalY=${destination.lat}&goalX=${destination.lon}&startY=${latitude}&startX=${longitude}`;

          // 모바일: 앱 실행 시도 → 2초 후 웹으로 대체
          if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            window.location.href = tmapAppUrl;
            setTimeout(() => {
              window.open(tmapWebUrl, '_blank');
            }, 2000);
          } else {
            // 데스크톱: 바로 웹 열기
            window.open(tmapWebUrl, '_blank');
          }
        },
        (error) => {
          // 위치 거부 시: 출발지 없이 목적지만 표시
          console.error('위치 권한 거부:', error);
          const tmapWebUrlNoStart = `https://apis.openapi.sk.com/tmap/app/routes?appKey=${import.meta.env.VITE_TMAP_API_KEY}&version=1&format=json&callback=result&goal=${destination.name}&goalY=${destination.lat}&goalX=${destination.lon}`;
          window.open(tmapWebUrlNoStart, '_blank');
        }
      );
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  };

  useEffect(() => {
    let mounted = true;

    const initNaverMap = () => {
      try {
        if (!mapRef.current) {
          console.error('Map container not found');
          return;
        }

        if (!window.naver || !window.naver.maps) {
          return;
        }

        const location = new window.naver.maps.LatLng(36.097854, 128.435753);
        
        const mapOptions = {
          center: location,
          zoom: 17,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);

        // 마커 추가
        new window.naver.maps.Marker({
          position: location,
          map: map,
          title: '토미스퀘어가든',
        });

        if (mounted) {
          setMapLoaded(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
        }
      }
    };

    // Naver Maps SDK 로드 대기
    let attempts = 0;
    const maxAttempts = 50;

    const checkNaver = () => {
      attempts++;
      console.log(`Checking Naver Maps... attempt ${attempts}`);

      if (window.naver && window.naver.maps) {
        console.log('Naver Maps SDK found!');
        initNaverMap();
      } else if (attempts < maxAttempts) {
        setTimeout(checkNaver, 100);
      } else {
        console.error('Naver Maps not loaded after timeout');
        if (mounted) {
          setError('네이버 지도를 로드하는데 시간이 초과되었습니다.');
        }
      }
    };

    const timer = setTimeout(checkNaver, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  // 지도 영역에서 페이지 전환 방지
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    const preventScroll = (e: Event) => {
      e.stopPropagation();
    };

    // 네이티브 이벤트 리스너로 모든 스크롤/터치 이벤트 차단
    mapContainer.addEventListener('wheel', preventScroll, { passive: false });
    mapContainer.addEventListener('touchstart', preventScroll, { passive: false });
    mapContainer.addEventListener('touchmove', preventScroll, { passive: false });
    mapContainer.addEventListener('touchend', preventScroll, { passive: false });

    return () => {
      mapContainer.removeEventListener('wheel', preventScroll);
      mapContainer.removeEventListener('touchstart', preventScroll);
      mapContainer.removeEventListener('touchmove', preventScroll);
      mapContainer.removeEventListener('touchend', preventScroll);
    };
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col items-center bg-[#f8f8f8]">
      {/* 상단 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-12 pb-6 px-6"
      >
        <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2">LOCATION</p>
        <h2 className="text-2xl font-myeongjo text-gray-800 mb-6">오시는 길</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">토미스퀘어가든, 4층 스퀘어가든홀</h3>
          <p className="text-sm text-gray-500">경상북도 구미시 인동35길 46, 4층</p>
          <p className="text-sm text-gray-600">Tel. 054-473-6799</p>
        </div>
      </motion.div>

      {/* 네이버 지도 - 양옆 꽉 채우기 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        ref={mapContainerRef}
        className="relative w-full overflow-hidden"
        style={{ height: '300px' }}
      >
        <div
          ref={mapRef}
          className="w-full h-full bg-gray-200"
        />
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

      {/* 네비게이션 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full px-1 py-8"
      >

        {/* 네비게이션 버튼 */}
        <div className="grid grid-cols-3 gap-3">
          <a
            href="https://map.naver.com/p/search/토미스퀘어가든?c=15.00,0,0,0,dh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden">
              <img src={loadImage('navermap')} alt="네이버지도" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] text-gray-700 font-medium">네이버지도</span>
          </a>

          <button
            onClick={handleTmapRoute}
            className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200 cursor-pointer"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden">
              <img src={loadImage('tmap')} alt="티맵" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] text-gray-700 font-medium">티맵</span>
          </button>

          <a
            href="https://map.kakao.com/link/map/토미스퀘어가든,36.097854,128.435753"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden">
              <img src={loadImage('kakaonav')} alt="카카오내비" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] text-gray-700 font-medium">카카오내비</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Location;