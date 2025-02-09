// types/payment.ts
export type PaymentMethod =
  | 'credit'
  | 'deposit'
  | 'phone'
  | 'kakao'
  | 'kakaomini';
export type ReceiptType = 'income' | 'expense' | 'none';
export type BankType = '' | 'shinhan' | 'woori' | 'kb';
export type AgreementKey = 'all' | 'terms1' | 'terms2' | 'terms3' | 'terms4';
export type Agreements = Record<AgreementKey, boolean>;
