import MainMenu from '@/components/features/main/MainMenu';
import { UserProfile } from '@/components/features/main/UserProfile';

export default function MainPage() {
  return (
    <div className="h-dvh min-h-screen bg-primary-main">
      <UserProfile nickname="닉네임테스트1234" />
      <MainMenu />
    </div>
  );
}
