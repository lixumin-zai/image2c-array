
import React, { useState, useCallback, ChangeEvent } from 'react';
import { Button } from './Button';

interface ImageUploadFormProps {
  onProcessImage: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onProcessImage, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        setSelectedFile(null);
        setPreviewUrl(null);
        event.target.value = ''; // Reset file input
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      onProcessImage(selectedFile);
    }
  }, [selectedFile, onProcessImage]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-700 p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium text-slate-300 mb-1">
          Upload Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-400
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-sky-600 file:text-white
                     hover:file:bg-sky-500
                     file:transition-colors file:duration-150
                     cursor-pointer"
        />
      </div>

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-slate-400 mb-2">Original Image Preview:</p>
          <img src={previewUrl} alt="Selected preview" className="max-w-full h-auto max-h-64 rounded-md border-2 border-slate-600" />
        </div>
      )}

      <Button type="submit" disabled={!selectedFile || isLoading} className="w-full">
        {isLoading ? 'Converting...' : 'Convert to C Array'}
      </Button>
    </form>
  );
};
