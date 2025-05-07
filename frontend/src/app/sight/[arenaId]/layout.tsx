import styles from './layout.module.scss';
import WriteButton from '@/components/sight/WriteButton/WriteButton';

export default function SectionSelectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <WriteButton />
    </>
  );
}
