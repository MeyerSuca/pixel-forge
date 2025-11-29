import React, { useRef, useState, useEffect } from 'react';
import { GeneratedImage } from '../types';
import { Download, Maximize2, Minimize2, Trash2, Code } from 'lucide-react';

interface SpriteDisplayProps {
  image: GeneratedImage;
  onDelete: (id: string) => void;
}

export const SpriteDisplay: React.FC<SpriteDisplayProps> = ({ image, onDelete }) => {
  const [pixelated, setPixelated] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Downscale Helper for downloading 64x64 specifically
  const downloadResized = (size: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      if (ctx) {
        // High quality downscaling usually requires step-down or just standard smoothing for "pixel art style" generated at high res
        // However, if the model generated crisp pixels at 1024, nearest neighbor might be best. 
        // Since GenAI models generate "painted" pixel art (usually not perfect grid alignment), 
        // standard smoothing often looks better when shrinking unless it's perfect 1:1 pixel mapping.
        ctx.imageSmoothingEnabled = false; 
        ctx.drawImage(img, 0, 0, size, size);
        
        const link = document.createElement('a');
        link.download = `sprite-${image.id}-${size}x${size}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = image.url;
  };

  const downloadOriginal = () => {
    const link = document.createElement('a');
    link.download = `sprite-${image.id}-original.png`;
    link.href = image.url;
    link.click();
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl transition-all hover:border-slate-700 animate-fade-in">
      <div className="relative group aspect-square w-full bg-[#1a1c2e] flex items-center justify-center overflow-hidden">
        {/* Background Grid Pattern to simulate transparency/editor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(45deg, #2a2d3d 25%, transparent 25%), linear-gradient(-45deg, #2a2d3d 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2d3d 75%), linear-gradient(-45deg, transparent 75%, #2a2d3d 75%)',
               backgroundSize: '20px 20px',
               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
             }} 
        />
        
        <img
          src={image.url}
          alt={image.prompt}
          className={`max-w-full max-h-full object-contain transition-all duration-300 ${pixelated ? 'image-pixelated' : ''}`}
          style={{ imageRendering: pixelated ? 'pixelated' : 'auto' }}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-4 p-4">
           <div className="flex gap-2">
             <button 
                onClick={() => downloadResized(64)}
                className="bg-primary hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transform hover:scale-105 transition-transform"
             >
               <Download size={14} /> 64x64
             </button>
             <button 
                onClick={downloadOriginal}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transform hover:scale-105 transition-transform"
             >
               <Download size={14} /> HD
             </button>
           </div>
        </div>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             onClick={() => onDelete(image.id)}
             className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <p className="text-slate-400 text-xs font-mono line-clamp-2 mb-3" title={image.prompt}>
          {image.prompt}
        </p>
        
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setPixelated(!pixelated)}
                className={`p-1.5 rounded-md transition-colors ${pixelated ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-800'}`}
                title="Toggle Pixel Rendering"
              >
                {pixelated ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <span className="text-xs text-slate-500 font-mono">
                {pixelated ? 'Nearest' : 'Smooth'}
              </span>
           </div>
           <span className="text-xs text-slate-600 font-mono">
             {new Date(image.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </span>
        </div>
      </div>
    </div>
  );
};