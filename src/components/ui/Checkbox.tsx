import { Check } from "lucide-react";

interface CheckboxProps {
  label: string;
  value: boolean;
  onChange: () => void;
}

function Checkbox({ label, value, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <div
        className={`w-5 h-5 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-sm cursor-pointer ${
          value
            ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-900"
            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-950"
        }`}
        onClick={onChange}
      >
        {value && <Check className="text-white w-4 h-4" />}
      </div>
      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium select-none">
        {label}
      </span>
    </div>
  );
}

export default Checkbox;
