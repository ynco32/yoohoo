import Image from 'next/image';

interface ReviewImagesProps {
  image: string | null;
}

export const ReviewImages = ({ image }: ReviewImagesProps) => (
  <div className="scrollbar-hide relative mb-4 w-full overflow-x-auto">
    <div className="flex gap-2 pb-4">
      <div className="w-64 flex-none first:pl-4 last:pr-4">
        {image && (
          <Image
            src={image}
            width={0}
            height={0}
            sizes="100vw"
            alt={`Review image`}
            className="h-48 w-full rounded-lg object-cover"
          />
        )}
      </div>
    </div>
  </div>
);
