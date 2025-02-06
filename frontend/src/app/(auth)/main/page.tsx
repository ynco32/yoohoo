import MainMenu from '@/components/features/main/MainMenu';
import { UserProfile } from '@/components/features/main/UserProfile';

export default function MainPage() {
  return (
    <div className="flex flex-col bg-white">
      <UserProfile nickname="닉네임테스트1234" level="Lv.1" steps={3420} />
      <MainMenu />
    </div>
  );
}
