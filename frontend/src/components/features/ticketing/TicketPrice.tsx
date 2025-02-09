// components/features/ticketing/TicketPrice.tsx
export const TicketPrice = ({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (value: number) => void;
}) => (
  <div className="bg-white px-4 py-3 text-sm">
    <div className="flex items-center justify-between">
      <span className="font-medium text-primary-main">기본가</span>
      <div className="flex items-center">
        <span className="font-medium text-primary-main">77,000원</span>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="ml-2 rounded border px-2 py-1"
        >
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num}매
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);
