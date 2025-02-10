// components/features/payment/PaymentMethodGroup.tsx
import React, { FC } from 'react';
import type { PaymentMethod } from '@/types/payments';

interface PaymentMethodGroupProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodGroup: FC<PaymentMethodGroupProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const topMethods: [PaymentMethod, string][] = [
    ['credit', '신용카드'],
    ['deposit', '무통장입금'],
    ['phone', '휴대폰결제'],
  ];

  const bottomMethods: [PaymentMethod, string][] = [
    ['kakao', '카카오페이'],
    ['kakaomini', '카카오페이 미니'],
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {topMethods.map(([value, label]) => (
          <label key={value} className="flex cursor-pointer items-center gap-2">
            <div className="relative">
              <input
                type="radio"
                name="payment"
                value={value}
                checked={selectedMethod === value}
                onChange={(e) => onSelect(e.target.value as PaymentMethod)}
                className="h-5 w-5"
              />
            </div>
            <span>{label}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {bottomMethods.map(([value, label]) => (
          <label key={value} className="flex cursor-pointer items-center gap-2">
            <div className="relative">
              <input
                type="radio"
                name="payment"
                value={value}
                checked={selectedMethod === value}
                onChange={(e) => onSelect(e.target.value as PaymentMethod)}
                className="h-5 w-5"
              />
            </div>
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
