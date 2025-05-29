
import React from 'react';

interface ProcessedImageViewProps {
  imageUrl: string | null;
  width: number;
  height: number;
}

export const ProcessedImageView: React.FC<ProcessedImageViewProps> = ({ imageUrl, width, height }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-sky-400 mb-4">Processed Image Preview</h2>
      <img 
        src={imageUrl} 
        alt="Processed" 
        className="max-w-full h-auto rounded-md border-2 border-slate-600 shadow-lg" 
        style={{ imageRendering: 'pixelated' }} // Good for seeing pixel-level detail
      />
      <p className="mt-3 text-sm text-slate-400">
        Dimensions: {width}w x {height}h
      </p>
    </div>
  );
};
