/**
 * @component UserInfo
 * @description 사용자의 기본 정보를 표시하는 컴포넌트입니다.
 * 유저의 레벨, 닉네임, 그리고 "최애로부터의 걸음 수"를 보여줍니다.
 *
 * @typedef {Object} UserInfoProps
 * @property {string} nickname - 사용자의 닉네임
 * @property {string} level - 사용자의 레벨 (e.g., "Lv.1")
 * @property {number} steps - 최애로부터의 걸음 수
 * @property {string} [className] - 추가적인 스타일링을 위한 클래스
 */

interface UserInfoProps {
  nickname: string;
  level: string;
  steps: number;
  className?: string;
}

export const UserInfo = ({
  nickname,
  level,
  steps,
  className,
}: UserInfoProps) => {
  return (
    <div className={`flex flex-col gap-xs ${className != null || ''}`}>
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
