import { cloneElement } from "react";

interface ButtonProps {
  title: string;
  icon?: React.ReactElement<{ className?: string }>;
  className?: string;
  disabled?: boolean;
  color?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function AccentButton({
  title,
  icon,
  className,
  color = "indigo",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <div className={className}>
      <button
        className={`w-full relative font-medium py-2.5 rounded-lg transition-colors  
        ${
          !disabled
            ? `bg-${color}-100 text-${color}-600 hover:bg-${color}-200 cursor-pointer`
            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 cursor-default"
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon &&
          cloneElement(icon, {
            className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
          })}
        <span className={icon ? "pl-2" : ""}>{title}</span>
      </button>
    </div>
  );
}

export default AccentButton;
