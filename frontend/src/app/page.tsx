import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-mobile h-mobile relative overflow-hidden bg-primary-main">
      {/* Hero 섹션 */}
      <div className="p-md">
        <Image 
          src="/images/loading.gif"  // public 폴더 기준 경로
          alt="Logo"
          width={200}  
          height={120}
          priority  // LCP(Largest Contentful Paint) 최적화
        />
      </div>
    </div>
  );
}