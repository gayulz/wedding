
import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
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

const ArchPhoto: React.FC<{ src: string; alt: string; onClick: () => void }> = ({ src, alt, onClick }) => {
  return (
    <div className="relative group shrink-0 cursor-pointer" onClick={onClick}>
      {/* Outer Glow / Luxury Border Gradient */}
      <div className="absolute -inset-[1px] rounded-t-full rounded-b-xl bg-gradient-to-tr from-[#e2e2e2] via-white to-[#f3f3f3] opacity-70 blur-[1px]"></div>

      <div className="relative w-40 h-52 md:w-44 md:h-56 bg-gray-50 rounded-t-full rounded-b-lg overflow-hidden shadow-xl border-[1px] border-white/40">
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fffcfc] overflow-hidden p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-10 w-full max-sm:max-w-[320px] max-w-sm items-center"
      >

        {/* Groom Section - Horizontal layout within the card */}
        <motion.div variants={itemVariants} className="w-full">
          <TiltCard>
            <ArchPhoto
              src={wedding99}
              alt="Groom"
              onClick={() => setSelectedImage(wedding99)}
            />

            <div className="text-left space-y-2 flex-1">
              <div className="text-gray-400 text-[10px] tracking-[0.3em] font-medium uppercase">GROOM</div>
              <div className="text-3xl font-myeongjo text-gray-800 font-bold">최봉석</div>
              <div className="text-gray-500 text-sm">
                <span className="font-light">석명순</span>
                <span className="text-xs ml-1">의 아들</span>
              </div>

              <div className="pt-3 flex justify-start gap-3">
                <a href="tel:010-4404-1519" className="liquid-glass w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-yellow-100 transition-all shadow-sm">
                  <i className="fa-solid fa-phone text-sm"></i>
                </a>
                <a href="sms:010-4404-1519" className="liquid-glass w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-yellow-100 transition-all shadow-sm">
                  <i className="fa-solid fa-envelope text-sm"></i>
                </a>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Horizontal Divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 w-full px-12">
          <div className="flex-1 h-[0.5px] bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30" />
          <div className="text-gray-300 font-myeongjo text-sm italic opacity-40">&</div>
          <div className="flex-1 h-[0.5px] bg-gradient-to-l from-transparent via-gray-300 to-transparent opacity-30" />
        </motion.div>

        {/* Bride Section - Horizontal layout within the card */}
        <motion.div variants={itemVariants} className="w-full">
          <TiltCard>
            <ArchPhoto
              src={wedding98}
              alt="Bride"
              onClick={() => setSelectedImage(wedding98)}
            />

            <div className="text-left space-y-2 flex-1">
              <div className="text-gray-400 text-[10px] tracking-[0.3em] font-medium uppercase">BRIDE</div>
              <div className="text-3xl font-myeongjo text-gray-800 font-bold">김가율</div>
              <div className="text-gray-500 text-sm">
                <span className="font-light">김상준</span>
                <span className="text-xs ml-1">의 딸</span>
              </div>

              <div className="pt-3 flex justify-start gap-3">
                <a href="tel:010-8790-1519" className="liquid-glass w-10 h-10 flex items-center justify-center text-pink-500 hover:bg-yellow-100 transition-all shadow-sm">
                  <i className="fa-solid fa-phone text-sm"></i>
                </a>
                <a href="sms:010-8790-1519" className="liquid-glass w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-yellow-100 transition-all shadow-sm">
                  <i className="fa-solid fa-envelope text-sm"></i>
                </a>
              </div>
            </div>
          </TiltCard>
        </motion.div>

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

export default Profiles;
