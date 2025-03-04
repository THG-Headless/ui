import React, { useState, useEffect, useRef } from 'react';
import { useLottie } from 'lottie-react';

// Content can be strings or simple objects that Astro can handle
interface TimeframeItem {
  time: number;
  label: string;
  title?: string; // Title for the section
  description?: string; // HTML/Markdown description
  codeBlock?: string; // Code block content as string
  codeLanguage?: string; // Language for the code block (default: css)
}

interface LottieTimelineNavigatorProps {
  animationData: any;
  timestamps: Array<TimeframeItem>;
  children?: React.ReactNode; // Now optional
}

const LottieTimelineNavigator: React.FC<LottieTimelineNavigatorProps> = ({
  animationData,
  timestamps,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [progressPercentage, setProgressPercentage] = useState(0); // Track progress independently
  const animationRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null); // For animation frame tracking

  const options = {
    animationData,
    loop: false,
    autoplay: false,
    onComplete: () => setIsAnimating(false),
  };

  const { View, playSegments, goToAndStop, animationItem } = useLottie(options);

  useEffect(() => {
    if (animationItem) {
      animationRef.current = animationItem;
    }
  }, [animationItem]);

  // Convert seconds to frames (60fps)
  const secondsToFrames = (seconds: number): number => Math.round(seconds * 60);

  // Go to current timestamp initially
  useEffect(() => {
    if (timestamps[currentIndex]) {
      const framePosition = secondsToFrames(timestamps[currentIndex].time);
      goToAndStop(framePosition, true);
      // Initialize progress percentage
      setProgressPercentage((currentIndex / (timestamps.length - 1)) * 100);
    }

    // Cleanup animation frames on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Navigate to a new section and animate between timestamps
  const navigateToSection = (
    newIndex: number,
    fromProgressBar: boolean = false
  ): void => {
    setCurrentIndex(newIndex);

    if (newIndex < 0 || newIndex >= timestamps.length || isAnimating) return;

    setIsAnimating(true);

    // Cancel any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const currentFrame: number = secondsToFrames(timestamps[currentIndex].time);
    const targetFrame: number = secondsToFrames(timestamps[newIndex].time);
    const startIndex = currentIndex;
    const endIndex = newIndex;

    // Adjust speed for progress bar navigation
    const speedMultiplier = fromProgressBar ? 2 : 1;

    // Set initial animation parameters
    const startTime = performance.now();
    const animationDuration =
      ((Math.abs(targetFrame - currentFrame) / 60) * 1000) / speedMultiplier;

    // Play animation
    playSegments([currentFrame, targetFrame], true);

    // Create smooth progress animation
    const animateProgress = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Calculate the current index progress (can be fractional during animation)
      const currentProgress = startIndex + (endIndex - startIndex) * progress;

      // Update progress bar percentage
      const percentage = (currentProgress / (timestamps.length - 1)) * 100;
      setProgressPercentage(percentage);

      // Continue animation until complete
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateProgress);
      } else {
        // Animation complete
        setCurrentIndex(newIndex);
        setIsAnimating(false);
        animationFrameRef.current = null;
      }
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animateProgress);

    // Backup timeout in case animation frame fails
    setTimeout(
      () => {
        if (isAnimating) {
          setProgressPercentage((newIndex / (timestamps.length - 1)) * 100);
          setIsAnimating(false);
        }
      },
      animationDuration + 100 // Add buffer
    );
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !isAnimating) {
      navigateToSection(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < timestamps.length - 1 && !isAnimating) {
      navigateToSection(currentIndex + 1);
    }
  };

  // New function to render the timeline progress bar
  const renderProgressBar = () => {
    return (
      <div
        className="timeline-progress-bar"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '10px',
          paddingBottom: '10px',
          marginRight: '20px',
          marginLeft: '20px',
        }}
      >
        {/* Base line */}
        <div
          className="progress-line"
          style={{
            position: 'absolute',
            height: '3px',
            backgroundColor: '#e2e8f0',
            width: '100%',
            zIndex: 1,
          }}
        />

        {/* Progress indicator - now using progressPercentage */}
        <div
          className="progress-indicator"
          style={{
            position: 'absolute',
            transform: 'translateY(-8px)',
            height: '5px',
            backgroundColor: '#3b82f6',
            width: `${progressPercentage}%`,
            transition: isAnimating ? 'none' : 'width 0.3s ease',
            zIndex: 2,
          }}
        />

        {/* Timestamp markers */}
        {timestamps.map((timestamp, index) => {
          // Calculate if this marker should be filled based on current progress
          const isFilled =
            (index / (timestamps.length - 1)) * 100 <= progressPercentage;

          return (
            <div
              key={`marker-${index}`}
              className={`timestamp-marker ${index === currentIndex ? 'active' : ''}`}
              style={{
                position: 'absolute',
                left: `${(index / (timestamps.length - 1)) * 100}%`,
                top: '50%',
                transform:
                  index === currentIndex
                    ? 'translate(-50%, -26px)'
                    : 'translate(-50%, -22px)',
                width: index === currentIndex ? '20px' : '12px',
                height: index === currentIndex ? '20px' : '12px',
                borderRadius: '100%',
                backgroundColor: isFilled ? '#3b82f6' : '#cbd5e1',
                border:
                  index === currentIndex
                    ? '4px solid white'
                    : '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: isAnimating ? 'wait' : 'pointer',
                zIndex: 3,
                transition: 'all 0.2s ease',
              }}
              onClick={() => !isAnimating && navigateToSection(index, true)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            ></div>
          );
        })}
      </div>
    );
  };

  const CodeBlockFormatter = ({
    codeBlock,
    language = '',
  }: {
    codeBlock: string;
    language?: string;
  }) => {
    return (
      <pre className={`language-${language}`}>
        <code>{codeBlock}</code>
      </pre>
    );
  };

  const renderContent = () => {
    try {
      const currentTimestamp = timestamps[currentIndex];

      if (!currentTimestamp) {
        return <div>No content defined for this slide</div>;
      }

      return (
        <div className="slide-content" style={{ borderRadius: '20px' }}>
          {currentTimestamp.description && (
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: currentTimestamp.description }}
            />
          )}

          {currentTimestamp.codeBlock && (
            <CodeBlockFormatter
              codeBlock={currentTimestamp.codeBlock}
              language={currentTimestamp.codeLanguage || 'css'}
            />
          )}
        </div>
      );
    } catch (error) {
      console.error('Error rendering slide content:', error);
      return <div>Error rendering content. See console for details.</div>;
    }
  };

  return (
    <div
      className="lottie-timeline-navigator"
      style={{ paddingTop: '30px', paddingBottom: '30px' }}
    >
      <div
        className="animation-container"
        style={{ maxWidth: '100%', borderRadius: '10px', overflow: 'hidden' }}
      >
        {View}
      </div>
      {/* Add progress bar */}
      {renderProgressBar()}
      <div
        className="navigation-controls"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '1rem 0',
        }}
      >
        {currentIndex > 0 ? (
          <button
            onClick={handlePrevious}
            disabled={isAnimating}
            style={{
              padding: '0.5rem 1rem',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
              borderRadius: '10px',
              borderColor: 'transparent',
            }}
          >
            ← Previous
          </button>
        ) : (
          <div style={{ width: '100px' }}></div> // Placeholder for layout balance
        )}

        <strong>{timestamps[currentIndex]?.label}</strong>

        {currentIndex < timestamps.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={isAnimating}
            style={{
              padding: '0.5rem 1rem',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
              marginTop: 0,
              borderRadius: '10px',
              borderColor: 'transparent',
            }}
          >
            Next →
          </button>
        ) : (
          <div style={{ width: '100px' }}></div> // Placeholder for layout balance
        )}
      </div>
      <div className="section-content" key={`content-${currentIndex}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default LottieTimelineNavigator;
