import React from 'react';

interface StepProgressBarProps {
  currentStep: number;
  handleNext?: () => void;
  handleBack?: () => void;
  className?: string;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  handleNext,
  handleBack,
  className = '',
}) => {
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

  const handleStepClick = (step: number) => {
    if (step === currentStep) return;

    if (step < currentStep && handleBack) {
      handleBack();
    } else if (step > currentStep && handleNext) {
      handleNext();
    }
  };

  return (
    <div
      className={`${className} mx-auto flex h-20 flex-col items-center justify-center space-y-md`}
    >
      {/* Title */}
      <h1 className="mb-sm text-head-bold text-gray-900">
        좌석의 후기를 남겨보세요
      </h1>

      {/* Progress Bar */}
      <div className="flex w-72 items-start justify-center space-x-lg">
        {/* 정보입력 섹션 */}
        <div
          className="group cursor-pointer text-center"
          onClick={() => handleStepClick(0)}
          role="button"
          tabIndex={0}
        >
          <div
            className={`${
              currentStep === 0 ? 'font-medium text-gray-900' : 'text-gray-400'
            } text-caption1-bold transition-colors duration-200 group-hover:text-gray-900`}
          >
            정보입력
          </div>
          <div className="mt-xs h-0.5 w-16 bg-gray-200 transition-colors duration-200 group-hover:bg-gray-300">
            <div
              className={`h-full ${getBarStyle(0)} transition-duration-normal`}
            />
          </div>
        </div>

        {/* 리뷰쓰기 섹션 */}
        <div
          className="group cursor-pointer text-center"
          onClick={() => handleStepClick(1)}
          role="button"
          tabIndex={0}
        >
          <div
            className={`${
              currentStep >= 1 ? 'font-medium text-gray-900' : 'text-gray-400'
            } text-caption1-bold transition-colors duration-200 group-hover:text-gray-900`}
          >
            리뷰쓰기
          </div>
          <div className="mt-xs flex w-16 gap-sm">
            <div className="h-0.5 flex-1 bg-gray-200 transition-colors duration-200 group-hover:bg-gray-300">
              <div
                className={`h-full ${
                  currentStep >= 1 ? 'bg-gray-900' : 'bg-gray-200'
                } transition-duration-normal`}
              />
            </div>
            <div className="h-0.5 flex-1 bg-gray-200 transition-colors duration-200 group-hover:bg-gray-300">
              <div
                className={`h-full ${
                  currentStep >= 2 ? 'bg-gray-900' : 'bg-gray-200'
                } transition-duration-normal`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar;
