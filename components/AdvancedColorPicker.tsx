import React, { useState, useEffect } from 'react';
import { RGB } from '../types';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const AdvancedColorPicker: React.FC<Props> = ({ color, onChange }) => {
  const [hex, setHex] = useState(color);
  const [rgb, setRgb] = useState<RGB>({ r: 255, g: 255, b: 255 });

  useEffect(() => {
    setHex(color);
    const parsed = hexToRgb(color);
    if (parsed) setRgb(parsed);
  }, [color]);

  const handleHexChange = (val: string) => {
    setHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      onChange(val);
    }
  };

  const handleRgbChange = (key: keyof RGB, val: string) => {
    const num = Math.min(255, Math.max(0, parseInt(val) || 0));
    const newRgb = { ...rgb, [key]: num };
    setRgb(newRgb);
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-black/20 border border-white/5">
      <div className="flex items-center gap-4">
        {/* Preview Square - Clickable */}
        <div className="relative group cursor-pointer">
          <div 
            className="w-12 h-12 rounded-lg border border-white/10 shadow-inner transition-transform group-hover:scale-105"
            style={{ backgroundColor: color }}
          ></div>
          <input 
            type="color" 
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Choose color"
          />
        </div>

        {/* Gradient Bar - Clickable */}
        <div className="flex-1">
          <div className="relative w-full h-6 rounded-full overflow-hidden shadow-sm group cursor-pointer">
            {/* Visual Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>
            {/* Interactive Input Overlay */}
            <input 
              type="color" 
              value={hex}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Choose color from spectrum"
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wide font-medium">Click bar to pick color</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Hex Code</label>
          <div className="relative">
             <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">#</span>
             <input 
              type="text" 
              value={hex.replace('#', '')} 
              onChange={(e) => handleHexChange('#' + e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-2 pl-6 py-1.5 text-sm text-neon-cyan focus:border-neon-cyan outline-none transition-colors"
            />
          </div>
        </div>
        
        {/* Added a handy copy button for UX */}
        <div className="flex items-end">
           <button 
             onClick={() => navigator.clipboard.writeText(hex)}
             className="w-full py-1.5 text-xs font-medium text-gray-400 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors"
           >
             Copy Hex
           </button>
        </div>
      </div>

      <div>
        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">RGB Values</label>
        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
             <input 
              type="number" 
              value={rgb.r}
              onChange={(e) => handleRgbChange('r', e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded px-1 py-1.5 text-sm text-center text-red-400 focus:border-red-500 focus:bg-white/10 outline-none transition-colors"
            />
            <span className="text-[10px] text-gray-600 text-center block mt-0.5">R</span>
          </div>
          <div className="relative">
             <input 
              type="number" 
              value={rgb.g}
              onChange={(e) => handleRgbChange('g', e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded px-1 py-1.5 text-sm text-center text-green-400 focus:border-green-500 focus:bg-white/10 outline-none transition-colors"
            />
            <span className="text-[10px] text-gray-600 text-center block mt-0.5">G</span>
          </div>
          <div className="relative">
             <input 
              type="number" 
              value={rgb.b}
              onChange={(e) => handleRgbChange('b', e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded px-1 py-1.5 text-sm text-center text-blue-400 focus:border-blue-500 focus:bg-white/10 outline-none transition-colors"
            />
            <span className="text-[10px] text-gray-600 text-center block mt-0.5">B</span>
          </div>
        </div>
      </div>
    </div>
  );
};