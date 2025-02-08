import React from 'react';
import { TextInput } from '@/components/ui/TextInput';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface CommentInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  title?: string;
}

export const CommentInput = ({
  value = '',
  onChange,
  error,
  placeholder = '상세한 후기를 남겨주시면 다른 사람에게 큰 도움이 됩니다',
  className = '',
  title = '총평',
}: CommentInputProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <FormSectionHeader title={title} />
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        multiline
        rows={4}
        error={error}
      />
    </div>
  );
};
