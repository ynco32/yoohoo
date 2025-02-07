// components/features/ticketing/DiscountSection.tsx
export const DiscountSection = () => (
  <div className="mt-2 bg-white px-4 py-3 text-sm">
    <div className="flex items-center justify-between border-b pb-3">
      <span className="text-gray-600">쿠폰</span>
      <div className="flex items-center">
        <span className="text-gray-400">사용가능 쿠폰 0장</span>
        <button className="ml-2">{'>'}</button>
      </div>
    </div>
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-600">공연예매권</span>
      <div className="flex items-center">
        <span className="text-gray-400">사용가능 0장</span>
        <button className="ml-2">{'>'}</button>
      </div>
    </div>
  </div>
);
