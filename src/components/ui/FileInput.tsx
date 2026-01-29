import { useId, useMemo, useRef } from "react";

type Props = {
  label?: string;
  value?: File | null;
  className?: string;
  accept?: string;
  readonly?: boolean;
  errors?: string[] | string;
  onChange?: (file: File | null) => void;
  preview?: boolean;
};

export default function FileInput({
  label,
  value,
  className,
  accept = "image/*",
  readonly = false,
  preview = true,
  errors,
  onChange,
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const fileName = value?.name ?? "Файл не выбран";

  const previewUrl = useMemo(() => {
    if (!value) return null;
    return URL.createObjectURL(value);
  }, [value]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={readonly}
        className="sr-only"
        onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        disabled={readonly}
        onClick={() => inputRef.current?.click()}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg border dark:bg-gray-700
          ${readonly ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
          ${
            errors ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          }`}
      >
        <span className="text-sm text-gray-800 dark:text-gray-100">
          {fileName}
        </span>

        <span className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white">
          Выбрать
        </span>
      </button>

      {preview && previewUrl && (
        <div className="mt-3">
          <img
            src={previewUrl}
            alt="preview"
            className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-600"
            onLoad={() => URL.revokeObjectURL(previewUrl)}
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {value?.name} ({Math.round((value?.size ?? 0) / 1024)} KB)
          </div>
        </div>
      )}
      {errors && (
        <div className="rounded-xl py-2 text-xs text-red-600">
          {Array.isArray(errors) ? (
            errors.map((m, i) => <p key={i}>{m}</p>)
          ) : (
            <p>{errors}</p>
          )}
        </div>
      )}
    </div>
  );
}
