interface PopupProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}

export default function Popup({ children, className, isOpen }: PopupProps) {
  if (!isOpen) return null;
  return (
    <div
      className={`${className ?? ''} pointer-events-none fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div className="pointer-events-auto w-full max-w-[300px] rounded-lg bg-white p-6">
        {children}
      </div>
    </div>
  );
}
