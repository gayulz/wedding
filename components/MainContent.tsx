import React, { forwardRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Intro from './Intro';
import Profiles from './Profiles';
import Gallery from './Gallery';
import Location from './Location';
import Rsvp from './Rsvp';
import Gift from './Gift';
import Guestbook from './Guestbook';
import { weddingData } from '@/data/content';

interface MainContentProps {
    onModalStateChange: (isOpen: boolean) => void;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    onActiveSectionChange?: (sectionId: string) => void;
}

const SECTIONS = ['intro', 'profiles', 'gallery', 'location', 'rsvp', 'gift', 'guestbook'];

const SectionDivider = () => (
    <div className="py-28 flex items-center justify-center opacity-30">
        <div className="w-16 h-[1px] bg-[#3c1e1e]" />
        <div className="mx-2 text-[#3c1e1e] font-serif text-xs">❦</div>
        <div className="w-16 h-[1px] bg-[#3c1e1e]" />
    </div>
);

const MainContent = forwardRef<HTMLDivElement, MainContentProps>(({ onModalStateChange, onScroll, onActiveSectionChange }, ref) => {
    useEffect(() => {
        if (!onActiveSectionChange) return;

        const options = {
            root: (ref as React.RefObject<HTMLDivElement>).current,
            threshold: 0.1,
            rootMargin: '-5% 0px -50% 0px'
        };

        const callback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    onActiveSectionChange(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(callback, { ...options, root: null });

        SECTIONS.forEach((section) => {
            const element = document.getElementById(section);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [onActiveSectionChange, ref]);

    return (
        <div
            ref={ref}
            className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth bg-[#f8f8f8]"
            onScroll={onScroll}
        >
            <div className="pb-8" />

            <section id="intro">
                <Intro />
            </section>

            <SectionDivider />

            <section id="profiles">
                <Profiles onModalStateChange={onModalStateChange} />
            </section>

            <SectionDivider />

            <section id="gallery">
                <Gallery onModalStateChange={onModalStateChange} />
            </section>

            <SectionDivider />

            <section id="location">
                <Location />
            </section>

            <SectionDivider />

            <section id="rsvp">
                <Rsvp onModalStateChange={onModalStateChange} />
            </section>

            <SectionDivider />

            <section id="gift">
                <Gift />
            </section>

            <SectionDivider />

            <section id="guestbook">
                <Guestbook onModalStateChange={onModalStateChange} />
            </section>

            <div className="h-24 flex items-center justify-center text-[#3c1e1e]/40 text-[10px] uppercase tracking-widest pb-8">
                {weddingData.footer.copyright}
            </div>
        </div>
    );
});

MainContent.displayName = 'MainContent';

export default MainContent;
