import ArrowPathButton from '@/components/ui/ArrowPathButton';
import SpeakerButton from '@/components/ui/SpeakerButton';

interface CaptchaProps {
  captchaText: React.ReactNode;
  generateCaptcha: () => void;
  speakCaptcha: () => void;
  inputText: string; // 혹시 유저가 이상한 값(이모티콘 등)을 넣을시 에러가 나는지 테스트하기
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Captcha({
  captchaText,
  generateCaptcha,
  speakCaptcha,
  inputText,
  handleInputChange,
}: CaptchaProps) {
  return (
    <div>
      <div className="flex items-center justify-center gap-4">
        <div
          className="w-full select-none rounded border px-10 py-6 text-center text-2xl font-bold tracking-wider"
          style={{ fontFamily: 'monospace', letterSpacing: '0.25em' }}
        >
          {captchaText}
        </div>
        <div className="flex flex-col gap-2">
          <ArrowPathButton onClick={generateCaptcha} />
          <SpeakerButton onClick={speakCaptcha} />
        </div>
      </div>

      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="대소문자 구분없이 문자입력"
        maxLength={6}
        className="mt-2 w-full rounded border p-2 tracking-wider"
      />
    </div>
  );
}
