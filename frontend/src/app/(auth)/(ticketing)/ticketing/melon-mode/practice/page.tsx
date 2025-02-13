import Link from 'next/link';

export default function Practice() {
  return (
    <div>
      <Link href="practice/entrance">
        <div>대기열 입장</div>
      </Link>
      <Link href="grapes">
        <div>포도알 잡기</div>
      </Link>
      <Link href="securityMessage">
        <div>보안 문자 입력</div>
      </Link>
      <Link href="allinone">
        <div>종합 연습</div>
      </Link>
    </div>
  );
}
