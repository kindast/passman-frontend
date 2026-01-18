import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  icon?: boolean;
  minLength?: number;
  maxLength?: number;
  errors?: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField({
  id,
  label,
  value,
  icon = true,
  minLength,
  maxLength,
  errors,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          id={id}
          minLength={minLength}
          maxLength={maxLength}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-12 py-2 border dark:text-white dark:bg-gray-700   rounded-lg focus:outline-none focus:ring-2  focus:border-transparent
           ${
             errors
               ? "border-red-500 focus:ring-red-500"
               : "border-gray-300  focus:ring-indigo-500 dark:border-gray-600"
           }`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600  dark:hover:text-gray-200"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {errors && (
        <div className=" rounded-xl py-2 text-xs text-red-600">
          {errors.map((value, index) => {
            return <p key={index}>{value}</p>;
          })}
        </div>
      )}
    </div>
  );
}

export default PasswordField;
