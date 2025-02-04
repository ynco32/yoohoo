import React, { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PhotoUploadProps {
  value?: File;
  onChange: (file?: File) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const PhotoUpload = ({
  value,
  onChange,
  label = '사진',
  placeholder = '사진을 업로드해주세요',
  className = '',
  error,
}: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(undefined);
    }
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      onChange(file);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(undefined);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="mb-1 block text-sm">{label}</label>}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={handleClick}
          className="flex h-full w-full items-center justify-center"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <CameraIcon className="h-6 w-6 text-gray-400" />
              <span className="text-sm text-gray-400">{placeholder}</span>
            </div>
          )}
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-status-warning">{error}</p>}
    </div>
  );
};
