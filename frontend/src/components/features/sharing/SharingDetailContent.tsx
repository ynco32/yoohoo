interface SharingDetailContentProps {
    content: string;
    startTime: string;
  }
  
  export const SharingDetailContent = ({ content }: SharingDetailContentProps) => {
    return (
      <div className="bg-gray-100 p-4">
        <p className="whitespace-pre-line">{content}</p>
      </div>
    );
  };