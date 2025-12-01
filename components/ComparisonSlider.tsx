import React, { useState, useRef } from 'react';

interface ComparisonSliderProps {
  originalImageSrc: string;
  processedImageSrc: string;
  onContinue: () => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ 
  originalImageSrc, 
  processedImageSrc, 
  onContinue 
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">AI Processing Complete</h2>
        <p className="text-gray-400">Drag the slider to compare the result.</p>
      </div>

      <div className="relative w-full max-w-3xl aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[url('https://media.istockphoto.com/id/1136536978/vector/seamless-pattern-transparency-grid-simulation-transparent-background-seamless-illustration.jpg?s=612x612&w=0&k=20&c=i3gTHdK0-W23t4F2qE2H8JueeWfJm8wb0BYJq3zQ2jQ=')] bg-contain group" ref={containerRef}>
        
        {/* Labels - Improved UX */}
        <div className="absolute top-4 left-4 z-30 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-white uppercase tracking-wider pointer-events-none select-none">
          Original
        </div>
        <div className="absolute top-4 right-4 z-30 px-3 py-1 bg-neon-cyan/20 backdrop-blur-md rounded-full border border-neon-cyan/50 text-xs font-bold text-neon-cyan uppercase tracking-wider pointer-events-none select-none shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          No Background
        </div>

        {/* Processed Image (Background Layer) */}
        <img 
          src={processedImageSrc} 
          alt="Processed" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" 
        />

        {/* Original Image (Foreground Layer - Clipped) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden border-r-4 border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.5)]"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={originalImageSrc} 
            alt="Original" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none max-w-none select-none"
            style={{ width: containerRef.current?.offsetWidth || '100%' }} 
          />
        </div>

        {/* Slider Thumb Visualization - Larger & Glowing */}
        <div 
          className="absolute inset-y-0 w-10 h-10 bg-neon-cyan rounded-full shadow-[0_0_25px_rgba(0,255,255,1)] flex items-center justify-center pointer-events-none transform -translate-x-1/2 top-1/2 z-30 ring-4 ring-black/20"
          style={{ left: `${sliderPosition}%` }}
        >
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>

        {/* Invisible Range Input for Interaction */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPosition} 
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
        />
      </div>

      <button 
        onClick={onContinue}
        className="group flex items-center gap-3 px-8 py-3 bg-neon-purple hover:bg-neon-purple/80 text-white rounded-lg font-semibold transition-all shadow-[0_0_20px_rgba(189,0,255,0.4)] hover:scale-105 active:scale-95"
      >
        <span>Open in Editor</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>

    </div>
  );
};