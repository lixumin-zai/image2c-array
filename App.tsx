
import React, { useState, useCallback } from 'react';
import { ImageUploadForm } from './components/ImageUploadForm';
import { ProcessedImageView } from './components/ProcessedImageView';
import { CodeDisplay } from './components/CodeDisplay';
import { Spinner } from './components/Spinner';
import { processImage } from './services/imageProcessor';
import { ProcessedImageResult } from './types'; // Assuming types.ts is created

const App: React.FC = () => {
  const [processedResult, setProcessedResult] = useState<ProcessedImageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalImageName, setOriginalImageName] = useState<string | null>(null);

  const handleImageProcess = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setProcessedResult(null);
    setOriginalImageName(file.name.split('.')[0] || 'image'); // Store original name for variable

    try {
      const result = await processImage(file);
      setProcessedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image processing.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      <div className="w-full max-w-4xl bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            Image to C Array Converter
          </h1>
          <p className="text-slate-400 mt-2">
            Upload an image, resize it (max 1024px largest side), and convert to a 4-bit grayscale C byte array.
          </p>
        </header>

        <ImageUploadForm onProcessImage={handleImageProcess} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 flex flex-col items-center">
            <Spinner />
            <p className="text-slate-300 mt-2">Processing image...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-700 text-red-100 rounded-lg text-center">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {processedResult && !isLoading && (
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <ProcessedImageView 
              imageUrl={processedResult.processedImageUrl} 
              width={processedResult.width} 
              height={processedResult.height} 
            />
            <CodeDisplay cCode={processedResult.cCode} imageName={originalImageName || 'image'} />
          </div>
        )}
      </div>
       <footer className="mt-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Image Converter. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
