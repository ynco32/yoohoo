import React, { useRef } from 'react';
import Image from 'next/image';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  className?: string;
  error?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  className = '',
  error,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const preview = value ? URL.createObjectURL(value) : undefined;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      <div className="flex flex-col gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={handleClick}
            className={`relative flex h-24 w-32 items-center justify-center rounded-lg transition-colors ${
              error
                ? 'border-2 border-red-500 bg-red-50 hover:bg-red-100'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {preview ? (
              <div className="relative h-full w-full">
                <Image
                  src={preview}
                  alt="업로드된 이미지 미리보기"
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 128px) 100vw, 128px"
                  priority={false}
                />
              </div>
            ) : (
              <CameraIcon
                className={`h-6 w-6 ${error ? 'text-red-400' : 'text-gray-400'}`}
              />
            )}
          </button>
          {preview != null && (
            <div
              role="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-900 bg-opacity-50 text-white hover:bg-opacity-70"
            >
              <XMarkIcon className="h-4 w-4" />
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};
