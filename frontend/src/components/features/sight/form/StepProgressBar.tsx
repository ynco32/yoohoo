import React from 'react';

interface StepProgressBarProps {
  currentStep: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep }) => {
  const getBarStyle = (stepNumber: number) => {
    if (currentStep === 0) {
      return stepNumber === 0 ? 'bg-gray-900' : 'bg-gray-200';
    } else if (currentStep === 1) {
      return 'bg-gray-900';
    } else if (currentStep === 2) {
      return 'bg-gray-900';
    }
    return 'bg-gray-200';
  };

  return (
    <div className="w-full">
      <div className="flex items-start justify-center space-x-8">
        {/* 정보입력 섹션 */}
        <div className="text-center">
          <div
            className={`relative px-4 pb-2 text-lg ${
              currentStep === 0 ? 'font-medium text-gray-900' : 'text-gray-400'
            }`}
          >
            정보입력
          </div>
          <div className="mt-2 h-0.5 w-32 bg-gray-200">
            <div
              className={`h-full ${getBarStyle(0)} transition-all duration-300`}
            />
          </div>
        </div>

        {/* 리뷰쓰기 섹션 */}
        <div className="text-center">
          <div
            className={`relative px-4 pb-2 text-lg ${
              currentStep >= 1 ? 'font-medium text-gray-900' : 'text-gray-400'
            }`}
          >
            리뷰쓰기
          </div>
          <div className="mt-2 flex w-32">
            <div className="h-0.5 flex-1 bg-gray-200">
              <div
                className={`h-full ${
                  currentStep >= 1 ? 'bg-gray-900' : 'bg-gray-200'
                } transition-all duration-300`}
              />
            </div>
            <div className="h-0.5 flex-1 bg-gray-200">
              <div
                className={`h-full ${
                  currentStep >= 2 ? 'bg-gray-900' : 'bg-gray-200'
                } transition-all duration-300`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar;
