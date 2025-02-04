import { TextInput } from '@/components/ui/TextInput';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface CommentInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const CommentInput = ({
  value,
  onChange,
  placeholder = '상세한 후기를 남겨주시면 다른 사람에게 큰 도움이 됩니다',
  className = '',
  error,
}: CommentInputProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <FormSectionHeader title="총평" />
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        multiline
        error={error}
      />
    </div>
  );
};

export default CommentInput;
