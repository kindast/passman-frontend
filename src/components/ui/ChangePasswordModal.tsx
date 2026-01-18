import { useState } from "react";
import AccentButton from "./AccentButton";
import Button from "./Button";
import PasswordField from "./PasswordField";

type FormErrors = { CurrentPassword: string[]; NewPassword: string[] };

interface ChangePasswordModalProps {
  errors?: FormErrors | string[];
  onClose: () => void;
  onChange: (currentPassword: string, newPassword: string) => void;
}

function ChangePasswordModal({
  errors,
  onClose,
  onChange,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-xl font-medium text-gray-900 dark:text-white">
          Изменить главный пароль
        </div>
        <div className="px-6 py-4 space-y-4 border-b border-gray-200 dark:border-gray-700 overflow-auto whitespace-pre-line text-gray-600">
          <PasswordField
            id="currentPassword"
            label="Текущий пароль"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={false}
            errors={
              errors && !Array.isArray(errors)
                ? errors.CurrentPassword
                : undefined
            }
          />
          <PasswordField
            id="newPassword"
            label="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={false}
            errors={
              errors && !Array.isArray(errors) ? errors.NewPassword : undefined
            }
          />
          <PasswordField
            id="confirmPassword"
            label="Подтверждение пароля"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={false}
            errors={
              newPassword !== confirmPassword
                ? ["Пароли не совпадают"]
                : undefined
            }
          />
          {errors && Array.isArray(errors) && (
            <div className=" rounded-xl py-2 text-xs text-red-600">
              {errors.map((value, index) => {
                return <p key={index}>{value}</p>;
              })}
            </div>
          )}
        </div>
        <div className="px-6 py-4 flex justify-end gap-2">
          <AccentButton title="Отмена" onClick={onClose} className="w-30" />
          <Button
            title="Сохранить"
            className="w-30"
            onClick={() => onChange(currentPassword, newPassword)}
            disabled={
              currentPassword === "" ||
              newPassword === "" ||
              newPassword !== confirmPassword
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
