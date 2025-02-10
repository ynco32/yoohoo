// components/features/payment/AgreementSection.tsx
import React, { FC } from 'react';
import type { AgreementKey, Agreements } from '@/types/payments';

interface AgreementSectionProps {
  agreements: Agreements;
  onAgreementChange: (key: AgreementKey, checked: boolean) => void;
  onAllAgreementChange: (checked: boolean) => void;
}

export const AgreementSection: FC<AgreementSectionProps> = ({
  agreements,
  onAgreementChange,
  onAllAgreementChange,
}) => {
  const terms: [AgreementKey, string][] = [
    ['terms1', '[필수] 예매 및 취소 수수료/취소기한을 확인하였으며 동의합니다'],
    ['terms2', '[필수] 개인정보 수집/이용에 동의합니다'],
    ['terms3', '[필수] 개인정보 제3자 제공 및 주최사 제공에 동의합니다'],
    ['terms4', '[필수] 카카오 전자금융거래 이용약관'],
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-lg">예매자 동의</span>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={agreements.all}
            onChange={(e) => onAllAgreementChange(e.target.checked)}
            className="h-5 w-5"
          />
          <span>전체 동의</span>
        </label>
      </div>

      <div className="space-y-2">
        {terms.map(([key, label]) => (
          <div key={key} className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreements[key]}
              onChange={(e) => onAgreementChange(key, e.target.checked)}
              className="mt-1 h-5 w-5 cursor-pointer"
            />
            <span className="cursor-pointer text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
