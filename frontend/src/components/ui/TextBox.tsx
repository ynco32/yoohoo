import { ReactNode } from 'react';

interface TextBoxProps {
  headText: ReactNode;
  bodyText?: ReactNode;
}

export const TextBox = ({ headText, bodyText }: TextBoxProps) => {
  return (
    <div className="px-3 py-20">
      <h2 className="head">{headText}</h2>
      <h1 className="body">{bodyText}</h1>
    </div>
  );
};
export default TextBox;
