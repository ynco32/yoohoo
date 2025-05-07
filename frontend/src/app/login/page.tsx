import LoginButton from '@/components/auth/LoginButton/LoginButton';

export default function LoginPage() {
  return (
    <div>
      <LoginButton isLogin={true} />
      <LoginButton isLogin={false} />
    </div>
  );
}
