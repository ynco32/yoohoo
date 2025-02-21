import MainMenu from '@/components/features/main/MainMenu';
import { UserProfile } from '@/components/features/main/UserProfile';

export default function MainPage() {
  return (
    <div className="flex h-full flex-col px-4">
      <UserProfile />
      <MainMenu />
    </div>
  );
}
