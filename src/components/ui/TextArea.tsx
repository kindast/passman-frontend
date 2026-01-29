interface TextAreaProps {
  label?: string;
  id: string;
  value: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  errors?: string[] | string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
}

function TextArea({
  label,
  id,
  placeholder = "",
  value,
  minLength,
  maxLength,
  errors,
  onChange,
  onBlur,
}: TextAreaProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          className="w-full px-4 py-2 border dark:text-white dark:border-gray-600 dark:bg-gray-700  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
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

export default TextArea;
