interface PopupProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}

export default function Popup({ children, className, isOpen }: PopupProps) {
  if (!isOpen) return null;
  return (
    <div
      className={`${className ?? ''} fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div className="z-50 w-full max-w-[300px] rounded-lg bg-white p-6">
        {children}
      </div>
    </div>
  );
}
