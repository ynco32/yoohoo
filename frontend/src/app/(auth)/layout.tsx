import { UserInitializer } from '@/provider/UserInitializer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserInitializer />
      {children}
    </>
  );
}
