import React from 'react';

interface LandingHeroProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onUpload }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] text-center px-4 relative overflow-hidden">
      
      {/* Decorative Particles (Simulated with divs) */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-neon-purple rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-neon-cyan rounded-full blur-[100px] opacity-10 animate-pulse"></div>

      <div className="relative z-10 space-y-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-2xl md:text-2xl font-bold tracking-tight text-white drop-shadow-lg">
          SnarsCut
        </h1>

        <div className="inline-block px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-xs font-semibold tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          Free Background Remover AI
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          Remove Backgrounds <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Instantly.</span>
        </h1>
        
        <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          Upload your image and let our advanced AI isolate your subject with pixel-perfect precision. 
          Edit, composite, and export in seconds.
        </p>

        <div className="pt-8">
          <label className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-transparent border-2 border-neon-cyan rounded-full cursor-pointer hover:bg-neon-cyan/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]">
            <span className="mr-3 text-xl">✨</span>
            <span className="text-lg">Upload Image</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={onUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
          </label>
          <p className="mt-4 text-xs text-gray-500 font-medium tracking-wide uppercase">
            Supports JPG, PNG • Max 10MB
          </p>
        </div>
      </div>
    </div>
  );
};