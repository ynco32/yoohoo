interface ReviewHeaderProps {
  concertTitle: string;
  nickName: string;
  profilePicture: string;
  seatInfo: string;
}

export const ReviewHeader = ({
  concertTitle,
  nickName,
  profilePicture,
  seatInfo,
}: ReviewHeaderProps) => (
  <div className="mb-4 flex items-center">
    <div className="flex w-full items-center gap-2">
      <img
        src={profilePicture}
        alt={`${nickName}의 프로필 사진`}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="flex flex-grow flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{nickName}</h2>
          <span className="rounded-md bg-primary-sub2 px-2 py-1 text-xs text-gray-100">
            {seatInfo}
          </span>
        </div>
        <span className="text-sm text-gray-600">{concertTitle}</span>
      </div>
    </div>
  </div>
);
