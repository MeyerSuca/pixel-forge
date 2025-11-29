import React from 'react';
import { GeneratedImage } from '../types';
import { SpriteDisplay } from './SpriteDisplay';

interface GalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-20 px-4 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 text-slate-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">No Sprites Yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Enter a prompt above to start generating your pixel art collection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-8 bg-primary rounded-full"></span>
          Collection
          <span className="text-sm font-normal text-slate-500 ml-2 bg-slate-800 px-2 py-0.5 rounded-full">{images.length}</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img) => (
          <SpriteDisplay key={img.id} image={img} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};