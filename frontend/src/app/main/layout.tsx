import styles from './layout.module.scss';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.container}>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
