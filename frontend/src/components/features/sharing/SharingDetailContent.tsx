interface SharingDetailContentProps {
  content: string;
  startTime: string;
}

export const SharingDetailContent = ({
  content,
}: SharingDetailContentProps) => {
  return (
    <div className="mx-4 p-3">
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
};
