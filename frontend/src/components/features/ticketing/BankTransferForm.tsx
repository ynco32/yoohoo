// components/features/payment/BankTransferForm.tsx
import React, { FC } from 'react';
import type { BankType, ReceiptType } from '@/types/payments';

interface BankTransferFormProps {
  bank: BankType;
  onBankChange: (bank: BankType) => void;
  receiptType: ReceiptType;
  onReceiptTypeChange: (type: ReceiptType) => void;
}

export const BankTransferForm: FC<BankTransferFormProps> = ({
  bank,
  onBankChange,
  receiptType,
  onReceiptTypeChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm">입금은행</label>
        <select
          value={bank}
          onChange={(e) => onBankChange(e.target.value as BankType)}
          className="w-full rounded-md border p-2"
        >
          <option value="">입금하실 은행을 선택하세요.</option>
          <option value="shinhan">신한은행</option>
          <option value="woori">우리은행</option>
          <option value="kb">KB국민은행</option>
        </select>
      </div>

      <div className="text-sm">
        <p>예금주: 멜론티켓</p>
      </div>

      <div>
        <p className="mb-2 text-sm">현금영수증</p>
        <div className="space-x-4">
          {[
            ['income', '소득공제'],
            ['expense', '지출증빙'],
            ['none', '미발행'],
          ].map(([value, label]) => (
            <label
              key={value}
              className="inline-flex cursor-pointer items-center"
            >
              <input
                type="radio"
                name="receipt"
                value={value}
                checked={receiptType === value}
                onChange={(e) =>
                  onReceiptTypeChange(e.target.value as ReceiptType)
                }
                className="mr-1 h-4 w-4"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        * 무통장 입금의 경우, 은행에 따라 오후 11시 30분 이후로는 온라인 입금이
        제한될 수 있습니다.
      </div>
      <div className="text-sm text-gray-500">
        * ATM 기기로는 가상 계좌 입금이 불가할 수 있으므로 인터넷뱅킹, 폰뱅킹
        사용이 불가능한 경우 다른 결제 수단을 이용해 주세요!
      </div>
    </div>
  );
};
