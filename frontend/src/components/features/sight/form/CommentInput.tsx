import React, { useEffect, useState } from 'react';
import { TextInput } from '@/components/ui/TextInput';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface CommentInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidation?: (result: ValidationResult) => void;
  placeholder?: string;
  className?: string;
}

export const CommentInput = ({
  value = '',
  onChange,
  onValidation,
  placeholder = '상세한 후기를 남겨주시면 다른 사람에게 큰 도움이 됩니다',
  className = '',
}: CommentInputProps) => {
  const [touched, setTouched] = useState(false);

  const validate = (): ValidationResult => {
    if (!value || value.trim().length === 0) {
      return {
        isValid: false,
        error: '후기를 작성해주세요',
      };
    }
    if (value.trim().length < 10) {
      return {
        isValid: false,
        error: '최소 10자 이상 작성해주세요',
      };
    }
    return { isValid: true };
  };

  useEffect(() => {
    if (touched) {
      const validationResult = validate();
      onValidation?.(validationResult);
    }
  }, [value, touched, onValidation]);

  const handleChange = (newValue: string) => {
    setTouched(true);
    onChange?.(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <FormSectionHeader title="총평" />
      <TextInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        multiline
        error={touched ? validate().error : undefined}
      />
    </div>
  );
};

export default CommentInput;
