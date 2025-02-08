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
  minLength?: number;
  title?: string;
}

export const CommentInput = ({
  value = '',
  onChange,
  onValidation,
  placeholder = '상세한 후기를 남겨주시면 다른 사람에게 큰 도움이 됩니다',
  className = '',
  minLength = 10,
  title = '총평',
}: CommentInputProps) => {
  const [touched, setTouched] = useState(false);

  const validate = (text: string): ValidationResult => {
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      return {
        isValid: false,
        error: '후기를 작성해주세요',
      };
    }

    if (trimmedText.length < minLength) {
      return {
        isValid: false,
        error: `최소 ${minLength}자 이상 작성해주세요`,
      };
    }

    return { isValid: true };
  };

  useEffect(() => {
    if (touched) {
      const validationResult = validate(value);
      onValidation?.(validationResult);
    }
  }, [value, touched, onValidation, minLength]);

  const handleChange = (newValue: string) => {
    setTouched(true);
    onChange?.(newValue);
  };

  const validationResult = touched ? validate(value) : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <FormSectionHeader title={title} />
      <TextInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        multiline
        rows={4}
        error={validationResult?.error}
      />
    </div>
  );
};

export default CommentInput;
