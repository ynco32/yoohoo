// components/features/ticketing/StepIndicator.tsx
export const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-between border-b bg-white px-4 py-3 text-sm">
    <div className="flex items-center">
      <span
        className={`h-6 w-6 rounded-full ${currentStep >= 1 ? 'bg-primary-main' : 'bg-gray-200'} flex items-center justify-center text-xs text-white`}
      >
        1
      </span>
      <span className={`ml-2 ${currentStep >= 1 ? 'text-primary-main' : ''}`}>
        좌석선택
      </span>
      <span className="mx-2">{'>'}</span>
    </div>
    <div className="flex items-center">
      <span
        className={`h-6 w-6 rounded-full ${currentStep >= 2 ? 'bg-primary-main' : 'bg-gray-200'} flex items-center justify-center text-xs text-white`}
      >
        2
      </span>
      <span className={`ml-2 ${currentStep >= 2 ? 'text-primary-main' : ''}`}>
        가격선택
      </span>
      <span className="mx-2">{'>'}</span>
    </div>
    <div className="flex items-center">
      <span
        className={`h-6 w-6 rounded-full ${currentStep >= 3 ? 'bg-primary-main' : 'bg-gray-200'} flex items-center justify-center text-xs text-white`}
      >
        3
      </span>
      <span className={`ml-2 ${currentStep >= 3 ? 'text-primary-main' : ''}`}>
        배송/결제
      </span>
    </div>
  </div>
);
