import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingData } from '@/data/content';

interface OpeningSequenceProps {
    onComplete: () => void;
}

const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onComplete }) => {
    const [text, setText] = useState('');
    const fullText = weddingData.opening.text;
    const [isTypingStarted, setIsTypingStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        // Start typing after initial delay (heartbeat starts immediately)
        const startTypingTimer = setTimeout(() => {
            setIsTypingStarted(true);
        }, 1000);

        return () => clearTimeout(startTypingTimer);
    }, []);

    useEffect(() => {
        if (isTypingStarted) {
            if (text.length < fullText.length) {
                const timeout = setTimeout(() => {
                    setText(fullText.slice(0, text.length + 1));
                }, 65); // Typing speed (Optimized: 1.5x faster)
                return () => clearTimeout(timeout);
            } else {
                // Typing finished
                const finishTimer = setTimeout(() => {
                    setIsFinished(true); // Trigger exit animation
                    setTimeout(onComplete, 1000); // Complete after fade out
                }, 500); // Wait a bit after typing is done
                return () => clearTimeout(finishTimer);
            }
        }
    }, [isTypingStarted, text, fullText, onComplete]);

    return (
        <AnimatePresence>
            {!isFinished && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                >
                    {/* Heartbeat Animation */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1, 1.2, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                            ease: "easeInOut"
                        }}
                        className="text-white text-5xl mb-8"
                    >
                        <i className="fa-solid fa-heart"></i>
                    </motion.div>

                    {/* Typewriter Text */}
                    <div className="h-8">
                        <p className="text-white text-xl font-myeongjo tracking-widest">
                            {text}
                            <span className="animate-pulse ml-1">|</span>
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OpeningSequence;
