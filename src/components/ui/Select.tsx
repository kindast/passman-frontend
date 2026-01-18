import { useState } from "react";
import TextField from "./TextField";
import { ChevronDown } from "lucide-react";

export type SelectValue = {
  id: string;
  label: string;
};

interface SelectProps {
  label: string;
  values: SelectValue[];
  selectedValue: SelectValue;
  onChange: (value: SelectValue) => void;
  onClose?: () => void;
}

function Select({ label, values, selectedValue, onChange }: SelectProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="relative select-none" onClick={(e) => e.stopPropagation()}>
      {label && (
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
          {label}
        </label>
      )}
      <div
        onClick={() => setShowModal((prev) => !prev)}
        className="cursor-pointer relative"
      >
        <TextField
          id="sort"
          readonly
          value={selectedValue.label}
          className="text-gray-600 dark:text-gray-300 select-none"
        />
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          showModal
            ? "absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 overflow-auto"
            : "hidden"
        }
      >
        {values.map((value) => (
          <div
            key={value.id}
            className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              onChange(value);
              setShowModal(false);
            }}
          >
            {value.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Select;
