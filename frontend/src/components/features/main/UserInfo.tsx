/**
 * @component UserInfo
 * @description 사용자의 기본 정보를 표시하는 컴포넌트입니다.
 * 유저의 레벨, 닉네임, 그리고 티어 정보를 보여줍니다.
 *
 * @typedef {Object} UserInfoProps
 * @property {string} nickname - 사용자의 닉네임
 * @property {string} level - 사용자의 레벨
 * @property {string} tier - 사용자의 티어
 * @property {string} [className] - 추가적인 스타일링을 위한 클래스
 */

interface UserInfoProps {
  nickname: string;
  level: string;
  tier: string;
  className?: string;
}

export const UserInfo = ({
  nickname,
  level,
  tier,
  className,
}: UserInfoProps) => {
  return (
    <div className={`flex flex-col gap-xs ${className ?? ''}`}>
      <div className="flex items-center gap-xs">
        <div className="inline-flex h-3.5 min-w-8 items-center justify-center rounded-3xl border border-primary-500 px-1">
          <span className="text-caption3 text-primary-500">{level}</span>
        </div>
        <span className="text-caption3-bold text-primary-500">{nickname}</span>
        <span className="text-caption3 text-primary-500">님</span>
      </div>
      <span className="text-profile text-gray-600">현재 티어: {tier}</span>
    </div>
  );
};
