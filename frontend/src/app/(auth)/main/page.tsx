import MainMenu from '@/components/features/main/MainMenu';
import { UserProfile } from '@/components/features/main/UserProfile';

export default function MainPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <UserProfile />
      <MainMenu />
    </div>
  );
}
