import AccentButton from "./AccentButton";
import Button from "./Button";
import PasswordField from "./PasswordField";

interface DeleteModalProps {
  title: string;
  text: string;
  password?: string;
  errors?: string[];
  onChangePassword?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onDelete: () => void;
}

function DeleteModal({
  title,
  text,
  password,
  onChangePassword,
  errors,
  onClose,
  onDelete,
}: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="px-6 py-4 border-b border-gray-200 text-xl font-medium text-gray-900 dark:border-gray-700 dark:text-white">
          {title}
        </div>
        <div className="px-6 py-4 space-y-4 border-b border-gray-200 dark:border-gray-700  overflow-auto whitespace-pre-line text-gray-600 dark:text-gray-300">
          {text}
          {password !== undefined && (
            <PasswordField
              id={"passwordConfirm"}
              label={""}
              value={password}
              onChange={(e) => {
                if (onChangePassword) onChangePassword(e);
              }}
              errors={errors}
            />
          )}
        </div>
        <div className="px-6 py-4 flex justify-end gap-2">
          <AccentButton
            title="Отмена"
            onClick={onClose}
            className="w-30"
            color="red"
          />
          <Button
            title="Удалить"
            className="w-30"
            onClick={onDelete}
            color="red"
            disabled={password !== undefined && password === "" ? true : false}
          />
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
