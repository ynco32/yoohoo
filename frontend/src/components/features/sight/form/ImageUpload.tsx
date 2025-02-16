import React, { useRef } from 'react';
import Image from 'next/image';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  onError?: (message: string) => void;
  className?: string;
  error?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  onError,
  className = '',
  error,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  // value가 변경될 때마다 preview 업데이트
  React.useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      onChange(null);
      return;
    }

    // 5MB = 5 * 1024 * 1024 bytes
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      // error prop이 있다면 에러 메시지 표시
      onError?.('파일 크기는 5MB를 초과할 수 없습니다.');
      if (inputRef.current) {
        inputRef.current.value = ''; // 입력 필드 초기화
      }
      return;
    }

    onChange(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

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
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};
