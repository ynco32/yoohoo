import React, { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  value?: File;
  onChange?: (file: File | undefined) => void;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  className = '',
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange?.(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(undefined);
    onChange?.(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      <div className="relative">
        <button
          type="button"
          onClick={handleClick}
          className="relative flex h-24 w-32 items-center justify-center rounded-lg bg-gray-50 transition-colors hover:bg-gray-100"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <CameraIcon className="h-6 w-6 text-gray-400" />
          )}
        </button>
        {preview && (
          <div
            role="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-900 bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <XMarkIcon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};
