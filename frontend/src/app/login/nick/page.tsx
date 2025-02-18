import NickNameModal from '@/components/features/auth/NickNameModal';

export default function nickname() {
  return (
    <div className="flex h-full flex-col bg-ticketing-bg">
      <div className="flex flex-col items-center justify-center px-4 pt-40">
        <span className="flex text-title-bold text-text-menu">
          닉네임을 지어주세요!
        </span>
        <span className="mt-1 flex flex-1 text-body text-sight-button">
          좌석 후기 및 나눔글에서 사용돼요.
        </span>
      </div>
      <div className="mt-4 flex justify-center">
        <NickNameModal />
      </div>
    </div>
  );
}
