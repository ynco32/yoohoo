interface ReviewHeaderProps {
  concertTitle: string;
  nickName: string;
  profilePicture: string;
}

export const ReviewHeader = ({
  concertTitle,
  nickName,
  profilePicture,
}: ReviewHeaderProps) => (
  <div className="mb-4 flex items-center">
    <div className="flex items-center gap-2">
      <img
        src={profilePicture}
        alt={`${nickName}의 프로필 사진`}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h2 className="text-lg font-bold">{nickName}</h2>
        <span className="text-sm text-gray-600">{concertTitle}</span>
      </div>
    </div>
  </div>
);
