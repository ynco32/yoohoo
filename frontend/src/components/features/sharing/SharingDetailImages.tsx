import Image from "next/image";

interface SharingDetailImagesProps {
  image: string;
}

export const SharingDetailImages = ({ image }: SharingDetailImagesProps) => {
  return (
    <div className="p-4">
      <div className="relative aspect-square">
        <Image src={image} alt="나눔 이미지" fill className="object-cover" />
      </div>
    </div>
  );
};
