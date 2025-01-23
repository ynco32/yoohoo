import Image from 'next/image';

export default function Home() {
  return (
    <div className="h-dvh min-h-screen">
      <div className="h-dvh min-h-screen bg-cover bg-center p-md">
        <Image
          src="/images/loading.gif"
          alt="Logo"
          width={200}
          height={120}
          priority
        />
      </div>
    </div>
  );
}
