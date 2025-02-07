import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  value?: File;
  onChange?: (file: File | undefined) => void;
  className?: string;
  required?: boolean;
  error?: string;
  onValidationChange?: (isValid: boolean) => void;
}

export const ImageUpload = ({
  onChange,
  className = '',
  required = false,
  error: externalError,
  onValidationChange,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>();
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file?: File) => {
    if (required && !file) {
      setError('이미지를 업로드해주세요');
      onValidationChange?.(false);
      return false;
    }
    setError(undefined);
    onValidationChange?.(true);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = validate(file);
    if (!isValid) return;

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
    validate(undefined);
  };

  // Use external error if provided, otherwise use internal error
  const displayError = externalError != null || error;

  return (
    <div className={className}>
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
              displayError
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
                className={`h-6 w-6 ${displayError ? 'text-red-400' : 'text-gray-400'}`}
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
        {displayError && <p className="text-sm text-red-500">{displayError}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
