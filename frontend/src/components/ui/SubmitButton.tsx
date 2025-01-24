// Button 컴포넌트
interface ButtonProps {
  children: React.ReactNode;
}

export const SubmitButton = ({ children }: ButtonProps) => (
  <button className="h-10 rounded-full bg-primary-main px-6 text-sm">
    {children}
  </button>
);
