// Button 컴포넌트
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SubmitButton = ({ children, ...props }: ButtonProps) => (
  <button
    className="h-10 rounded-full bg-primary-main px-6 text-sm hover:bg-primary-main/80 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50"
    {...props}
  >
    {children}
  </button>
);
