import Image from 'next/image';

interface SharingDetailImagesProps {
  image: string;
}

export const SharingDetailImages = ({ image }: SharingDetailImagesProps) => {
  return (
    <div className="p-5">
      <div className="relative aspect-square w-full">
        <Image
          src={image}
          alt="나눔 이미지"
          sizes="(max-width: 430px) 100vw, 430px"
          fill
          className="rounded-xl object-cover" // 이미지 둥글게
        />
      </div>
    </div>
  );
};
