interface UserInfoProps {
  nickname: string;
  level: string;
  steps: number;
}

export const UserInfo = ({ nickname, level, steps }: UserInfoProps) => {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center gap-xs">
        <div className="inline-flex h-3.5 min-w-8 items-center justify-center rounded-3xl border border-primary-500 px-1">
          <span className="text-caption3 text-primary-500">{level}</span>
        </div>
        <span className="text-caption3-bold text-primary-500">{nickname}</span>
        <span className="text-caption3 text-primary-500">님, 오늘은</span>
      </div>
      <span className="text-profile text-gray-600">
        최애로부터 {steps.toLocaleString()}걸음
      </span>
    </div>
  );
};
