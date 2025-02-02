interface SharingDetailContentProps {
    content: string;
    startTime: string;
  }
  
  export const SharingDetailContent = ({ content, startTime }: SharingDetailContentProps) => {
    return (
      <div className="bg-gray-100 p-4 space-y-2">
        <div className="flex justify-end">
          <span>• {startTime} 시작</span>
        </div>
        <p className="whitespace-pre-line">{content}</p>
      </div>
    );
  };