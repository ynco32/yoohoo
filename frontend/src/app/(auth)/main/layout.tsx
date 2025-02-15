export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container px-8">{children}</div>;
}
