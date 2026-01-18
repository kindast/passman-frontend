import { cloneElement } from "react";

interface TextButtonProps {
  label: string;
  icon?: React.ReactElement<{ className?: string }>;
  className?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function TextButton({ label, icon, className, onClick }: TextButtonProps) {
  return (
    <div className={className}>
      <button
        className="font-medium  text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center"
        onClick={onClick}
      >
        {icon && cloneElement(icon, { className: "w-4 h-4 inline mr-1" })}
        {label}
      </button>
    </div>
  );
}

export default TextButton;
