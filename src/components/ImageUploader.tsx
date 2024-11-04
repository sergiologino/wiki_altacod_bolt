import React, { useState, forwardRef } from 'react';
import { Image, Link, Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageInsert: (url: string) => void;
}

const ImageUploader = forwardRef<HTMLInputElement, ImageUploaderProps>(({ onImageInsert }, ref) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      onImageInsert(imageUrl);
      setImageUrl('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => (ref as React.RefObject<HTMLInputElement>).current?.click()}
          title="Upload image"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setShowUrlInput(!showUrlInput)}
          title="Insert image URL"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>
      
      {showUrlInput && (
        <form
          onSubmit={handleUrlSubmit}
          className="absolute z-10 mt-1 p-2 bg-white border rounded-md shadow-lg"
        >
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="px-2 py-1 border rounded text-sm"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Insert
            </button>
          </div>
        </form>
      )}
    </div>
  );
});

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;