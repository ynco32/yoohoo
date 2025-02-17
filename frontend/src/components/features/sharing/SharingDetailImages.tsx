import Image from 'next/image';

interface SharingDetailImagesProps {
  image: string;
}

export const SharingDetailImages = ({ image }: SharingDetailImagesProps) => {
  return (
    <div className="relative h-[270px] w-full">
      <Image
        src={image}
        alt="나눔 이미지"
        sizes="(max-width: 430px) 100vw, 430px"
        fill
        className="object-cover"
      />
    </div>
  );
};
