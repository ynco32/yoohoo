interface BadgeProps {
  children: React.ReactNode;
  type: 'pink' | 'green' | 'grey';
}

const Badge = ({ children, type }: BadgeProps) => {
  const colors = {
    grey: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    pink: 'bg-pink-100 text-pink-800',
  };

  return (
    <span className={`rounded-md px-2 py-1 text-sm ${colors[type]}`}>
      {children}
    </span>
  );
};

export default Badge;
