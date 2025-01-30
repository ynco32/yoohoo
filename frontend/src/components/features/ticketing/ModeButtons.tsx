import Link from 'next/link';
import { IconButton } from '@/components/ui/IconButton';

export default function Mode() {
  return (
    <div className="flex flex-col justify-center gap-3 bg-primary-50 px-3 py-3">
      <Link href="/ticketing/melon-mode/practice">
        <IconButton>
          <h2>연습 모드</h2>
          <h3>단계별 연습</h3>
        </IconButton>
      </Link>
      <Link href="/ticketing/melon-mode/real">
        <IconButton>
          <h2>실전 모드 시작</h2>
          <h3>실전과 똑같은 연습</h3>
        </IconButton>
      </Link>
    </div>
  );
}
