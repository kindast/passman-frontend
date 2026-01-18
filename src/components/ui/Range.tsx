interface RangeProps {
  label?: string;
  id: string;
  value: number;
  min: number;
  max: number;
  className?: string;
  readonly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Range({
  label,
  id,
  value,
  className,
  min,
  max,
  onChange,
}: RangeProps) {
  return (
    <div className={className + " relative"}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={onChange}
          className={`w-full py-2`}
        />
      </div>
      <div className="absolute right-0 top-0 dark:text-gray-300">{value}</div>
    </div>
  );
}

export default Range;
