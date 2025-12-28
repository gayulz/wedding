
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import wedding98 from '../images/wedding-98.jpeg';
import wedding99 from '../images/wedding-99.jpeg';

const TiltCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-all duration-300 flex flex-row items-center justify-center w-full gap-6 px-4"
    >
      {children}
    </motion.div>
  );
};

const ArchPhoto: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <div className="relative group shrink-0">
      {/* Outer Glow / Luxury Border Gradient */}
      <div className="absolute -inset-[1px] rounded-t-full rounded-b-xl bg-gradient-to-tr from-[#e2e2e2] via-white to-[#f3f3f3] opacity-70 blur-[1px]"></div>
      
      <div className="relative w-28 h-40 md:w-32 md:h-44 bg-gray-50 rounded-t-full rounded-b-lg overflow-hidden shadow-xl border-[1px] border-white/40">
        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]"></div>
        
        {/* Inner Shadow for Depth */}
        <div className="absolute inset-0 z-20 shadow-[inner_0_0_15px_rgba(0,0,0,0.1)] pointer-events-none"></div>

        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
      </div>
    </div>
  );
};

const Profiles: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fffcfc] overflow-hidden p-6">
      <div className="flex flex-col gap-10 w-full max-sm:max-w-[320px] max-w-sm items-center">
        
        {/* Groom Section - Horizontal layout within the card */}
        <TiltCard>
          <ArchPhoto 
            src={wedding99} 
            alt="Groom" 
          />
          
          <div className="text-left space-y-2 flex-1">
            <div className="text-gray-400 text-[9px] tracking-[0.3em] font-medium uppercase">GROOM</div>
            <div className="text-2xl font-myeongjo text-gray-800 font-bold">최봉석</div>
            <div className="text-gray-500 text-[12px]">
              <span className="font-light">석명순</span>
              <span className="text-[10px] ml-1">의 아들</span>
            </div>
            
            <div className="pt-3 flex justify-start gap-3">
              <a href="tel:010-4404-1519" className="liquid-glass w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-white/50 transition-all shadow-sm">
                <i className="fa-solid fa-phone text-sm"></i>
              </a>
              <a href="sms:010-4404-1519" className="liquid-glass w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white/50 transition-all shadow-sm">
                <i className="fa-solid fa-envelope text-sm"></i>
              </a>
            </div>
          </div>
        </TiltCard>

        {/* Horizontal Divider */}
        <div className="flex items-center gap-4 w-full px-12">
          <div className="flex-1 h-[0.5px] bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30" />
          <div className="text-gray-300 font-myeongjo text-sm italic opacity-40">&</div>
          <div className="flex-1 h-[0.5px] bg-gradient-to-l from-transparent via-gray-300 to-transparent opacity-30" />
        </div>

        {/* Bride Section - Horizontal layout within the card */}
        <TiltCard>
          <ArchPhoto 
            src={wedding98} 
            alt="Bride" 
          />

          <div className="text-left space-y-2 flex-1">
            <div className="text-gray-400 text-[9px] tracking-[0.3em] font-medium uppercase">BRIDE</div>
            <div className="text-2xl font-myeongjo text-gray-800 font-bold">김가율</div>
            <div className="text-gray-500 text-[12px]">
              <span className="font-light">김상준</span>
              <span className="text-[10px] ml-1">의 딸</span>
            </div>
            
            <div className="pt-3 flex justify-start gap-3">
              <a href="tel:010-8790-1519" className="liquid-glass w-10 h-10 flex items-center justify-center text-pink-500 hover:bg-white/50 transition-all shadow-sm">
                <i className="fa-solid fa-phone text-sm"></i>
              </a>
              <a href="sms:010-8790-1519" className="liquid-glass w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white/50 transition-all shadow-sm">
                <i className="fa-solid fa-envelope text-sm"></i>
              </a>
            </div>
          </div>
        </TiltCard>

      </div>
    </div>
  );
};

export default Profiles;
