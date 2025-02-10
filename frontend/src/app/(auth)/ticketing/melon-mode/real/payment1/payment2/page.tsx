// app/(auth)/ticketing/payment/page.tsx
'use client';

import React, { useState } from 'react';
import { PaymentMethodGroup } from '@/components/features/ticketing/PaymentMethodGroup';
import { BankTransferForm } from '@/components/features/ticketing/BankTransferForm';
import { AgreementSection } from '@/components/features/ticketing/AgreementSection';
import { StepIndicator } from '@/components/features/ticketing/StepIndicator';
import type {
  PaymentMethod,
  BankType,
  ReceiptType,
  AgreementKey,
  Agreements,
} from '@/types/payments';

export default function PaymentPage() {
  // State 관리
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [bank, setBank] = useState<BankType>('');
  const [receiptType, setReceiptType] = useState<ReceiptType>('none');
  const [agreements, setAgreements] = useState<Agreements>({
    all: false,
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
  });

  // 약관 동의 처리
  const handleAllAgreements = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms1: checked,
      terms2: checked,
      terms3: checked,
      terms4: checked,
    });
  };

  const handleSingleAgreement = (key: AgreementKey, checked: boolean) => {
    const newAgreements = {
      ...agreements,
      [key]: checked,
    };

    const termKeys: AgreementKey[] = ['terms1', 'terms2', 'terms3', 'terms4'];
    const allChecked = termKeys.every((k) => newAgreements[k]);

    setAgreements({
      ...newAgreements,
      all: allChecked,
    });
  };

  // 결제 처리
  const handleSubmit = () => {
    if (paymentMethod === 'deposit' && bank != null) {
      alert('입금하실 은행을 선택해주세요.');
      return;
    }
    if (paymentMethod === 'deposit' && receiptType !== 'none') {
      alert('현금영수증 미발행을 선택해주세요.');
      return;
    }
    if (!agreements.all) {
      alert('모든 약관에 동의해주세요.');
      return;
    }
    alert('연습용이므로 실제 결제는 진행되지 않습니다.');
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white">
      {/* Progress Steps */}
      <StepIndicator currentStep={3} />

      <div className="space-y-6 p-4">
        {/* 예매 정보 */}
        <section>
          <h2 className="mb-2 text-lg">예매정보</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm">이름</span>
              <input
                type="text"
                value="홍길동"
                disabled
                className="rounded-md border bg-gray-50 p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm">연락처</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value="010"
                  disabled
                  className="rounded-md border bg-gray-50 p-2"
                />
                <input
                  type="text"
                  value="1234"
                  disabled
                  className="rounded-md border bg-gray-50 p-2"
                />
                <input
                  type="text"
                  value="5678"
                  disabled
                  className="rounded-md border bg-gray-50 p-2"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm">E-mail</span>
              <input
                type="text"
                value="example@naver.com"
                disabled
                className="rounded-md border bg-gray-50 p-2"
              />
            </div>
          </div>
        </section>

        {/* 결제 수단 */}
        <section>
          <h2 className="mb-4 text-lg">결제수단</h2>
          <PaymentMethodGroup
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </section>

        {/* 무통장입금 폼 */}
        {paymentMethod === 'deposit' && (
          <BankTransferForm
            bank={bank}
            onBankChange={setBank}
            receiptType={receiptType}
            onReceiptTypeChange={setReceiptType}
          />
        )}

        {/* 결제 금액 */}
        <section className="rounded-md bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span>총 결제금액</span>
            <span className="text-xl font-bold text-primary-main">
              79,000원
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>티켓금액</span>
            <span>77,000원</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>예매수수료</span>
            <span>2,000원</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>배송료</span>
            <span>0원</span>
          </div>
        </section>

        {/* 약관 동의 */}
        <AgreementSection
          agreements={agreements}
          onAgreementChange={handleSingleAgreement}
          onAllAgreementChange={handleAllAgreements}
        />

        {/* 결제하기 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full rounded-md bg-primary-main py-4 text-lg text-white"
        >
          79,000원 결제하기
        </button>
      </div>
    </div>
  );
}
