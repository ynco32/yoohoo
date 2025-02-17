import MyMenu from '@/components/features/mypage/MyMenu';
import MyProfile from '@/components/features/mypage/MyProfile';

export default function MyPage() {
  return (
    <div className="h-full bg-sight-main-gra">
      <div className="mx-auto flex w-full items-center justify-center">
        <MyProfile />
      </div>
      <div className="container my-4 flex w-full flex-1 items-center justify-center">
        <MyMenu />
      </div>
    </div>
  );
}
