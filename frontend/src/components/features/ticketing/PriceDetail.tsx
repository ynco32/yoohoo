// components/features/ticketing/PriceDetail.tsx
export const PriceDetail = ({ quantity }: { quantity: number }) => (
  <div className="bg-gray-50 px-4 py-3 text-sm">
    <h3 className="mb-4 text-center">구매금액</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>티켓금액</span>
        <span>{(77000 * quantity).toLocaleString()}원</span>
      </div>
      <div className="flex justify-between">
        <span>예매수수료</span>
        <span>{(2000 * quantity).toLocaleString()}원</span>
      </div>
      <div className="mt-4 flex justify-between font-bold">
        <span>총 결제금액</span>
        <span className="text-primary-main">
          {((77000 + 2000) * quantity).toLocaleString()}원
        </span>
      </div>
    </div>
  </div>
);
