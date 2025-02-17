'use client';

interface MenuCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MenuCard = ({
  children,
  className = '',
  onClick,
}: MenuCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`${className} flex flex-col items-center justify-center bg-gray-50 p-6 shadow transition-shadow hover:shadow-md`}
    >
      {children}
    </div>
  );
};
