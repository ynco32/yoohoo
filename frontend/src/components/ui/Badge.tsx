interface BadgeProps {
  children: React.ReactNode;
  type: 'pink' | 'green' | 'grey';
}

const Badge = ({ children, type }: BadgeProps) => {
  const colors = {
    grey: 'bg-gray-100 text-gray-800',
    green: 'bg-[#00C73C] text-white',
    pink: 'bg-[#FF4B93] text-white',
  };

  return (
    <span
      className={`inline-block rounded-sm px-3 py-0.5 text-xs font-medium ${colors[type]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
