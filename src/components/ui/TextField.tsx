import { cloneElement } from "react";

interface TextFieldProps {
  label?: string;
  id: string;
  value: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactElement<{ className?: string }>;
  className?: string;
  readonly?: boolean;
  errors?: string[] | string;
  minLength?: number;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

function TextField({
  label,
  id,
  type = "text",
  placeholder = "",
  value,
  icon,
  className,
  readonly = false,
  errors,
  minLength,
  maxLength,
  onChange,
  onBlur,
}: TextFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon &&
          cloneElement(icon, {
            className:
              "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400",
          })}
        <input
          readOnly={readonly}
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          minLength={minLength}
          maxLength={maxLength}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-2 border dark:text-white dark:bg-gray-700   rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            readonly && "cursor-default"
          } ${
            errors
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300  focus:ring-indigo-500 dark:border-gray-600"
          }`}
          placeholder={placeholder}
        />
      </div>
      {errors && (
        <div className=" rounded-xl py-2 text-xs text-red-600">
          {Array.isArray(errors) ? (
            errors.map((value, index) => {
              return <p key={index}>{value}</p>;
            })
          ) : (
            <p>{errors}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TextField;
