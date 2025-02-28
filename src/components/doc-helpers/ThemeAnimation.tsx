import React, { useState } from 'react';
import { useLottie } from 'lottie-react';
import groovyWalkAnimation from './animations/theming.json';

interface TimelineEntry {
  timestamp: number;
  caption: string;
}

const timeline: TimelineEntry[] = [
  { timestamp: 1.5, caption: 'Site Variables' },
  { timestamp: 3.4, caption: 'Generate Shades' },
  { timestamp: 5.2, caption: 'Alias Variables' },
  { timestamp: 9.1, caption: 'Skins' },
  { timestamp: 11, caption: 'Semantic Interactive' },
  { timestamp: 13.5, caption: 'Applying To Component' },
  { timestamp: 15.6, caption: 'Multiple styles of component' },
  { timestamp: 22, caption: 'Cascading variables' },
  { timestamp: 23.4, caption: 'Cascading themes' },
  { timestamp: 25.5, caption: 'Theming Updates' },
];

const FPS = 60;
const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

const ThemeAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const options = {
    animationData: groovyWalkAnimation,
    loop: false,
    autoplay: false,
  };

  const { View, playSegments, goToAndStop } = useLottie(options);

  const playNextSegment = () => {
    if (currentIndex < timeline.length - 1) {
      const start = secondsToFrames(timeline[currentIndex].timestamp);
      const end = secondsToFrames(timeline[currentIndex + 1].timestamp);
      playSegments([start, end], true);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const playPreviousSegment = () => {
    if (currentIndex > 0) {
      const start = secondsToFrames(timeline[currentIndex].timestamp);
      const end = secondsToFrames(timeline[currentIndex - 1].timestamp);
      playSegments([start, end], true);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full  mx-auto rounded-lg pb-6 !mt-6 bg-slate-800">
      <div className="w-full relative bg-gray-50 rounded-t-lg overflow-hidden border border-gray-200">
        <div className="pb-[75%]">
          {' '}
          {/* 75% creates a 4:3 aspect ratio (600/800 = 0.75) */}
          <div className="absolute inset-0">{View}</div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full mt-6 px-4">
        <button
          onClick={playPreviousSegment}
          disabled={currentIndex === 0}
          className="text-lg font-black size-12 rounded-full border border-gray-200 bg-white text-black
                     hover:bg-gray-50 transition-colors hover:cursor-pointer disabled:invisible"
        >
          ←
        </button>
        <span className="text-body text-white font-medium">
          {timeline[currentIndex].caption}
        </span>
        <button
          onClick={playNextSegment}
          disabled={currentIndex === timeline.length - 1}
          className="text-lg font-black size-12 rounded-full border border-gray-200 bg-white text-black
                     hover:bg-gray-50 transition-colors hover:cursor-pointer disabled:invisible"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ThemeAnimation;
