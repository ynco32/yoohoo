import Mode from '@/components/features/ticketing/ModeButtons';
import { TextBox } from '@/components/ui/TextBox';

export default function ModeSelect() {
  return (
    <div>
      <TextBox headText="모드를 선택하세요"></TextBox>
      <Mode></Mode>
    </div>
  );
}
