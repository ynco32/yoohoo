import Image from 'next/image';

interface ReviewImagesProps {
  images: string[];
}

export const ReviewImages = ({ images }: ReviewImagesProps) => (
  <div className="scrollbar-hide relative mb-4 w-full overflow-x-auto">
    <div className="flex gap-2 pb-4">
      {images.map((image, index) => (
        <div key={index} className="w-64 flex-none first:pl-4 last:pr-4">
          <Image
            src={image}
            width={0}
            height={0}
            sizes="100vw"
            alt={`Review image ${index + 1}`}
            className="h-48 w-full rounded-lg object-cover"
          />
        </div>
      ))}
    </div>
  </div>
);
