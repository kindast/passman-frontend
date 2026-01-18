import { KeyRound } from "lucide-react";
import AccentButton from "../components/ui/AccentButton";
import Button from "../components/ui/Button";
import PasswordField from "../components/ui/PasswordField";
import TextArea from "../components/ui/TextArea";
import TextButton from "../components/ui/TextButton";
import TextField from "../components/ui/TextField";
import Checkbox from "../components/ui/Checkbox";
import { useCallback, useEffect, useState } from "react";
import {
  passwordService,
  type Password,
} from "../services/api/passwordService";
import Range from "../components/ui/Range";

type FormErrors = {
  ServiceName: string[];
  Url: string[];
  Login: string[];
  Password: string[];
  Category: string[];
  Notes: string[];
};

interface PasswordModalProps {
  title: string;
  initialPassword?: Password;
  errors?: string[] | FormErrors;
  onClose: () => void;
  onSave: (password: Password) => void;
}

function PasswordModal({
  title,
  errors,
  initialPassword,
  onClose,
  onSave,
}: PasswordModalProps) {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  //Text Fields
  const [serviceName, setServiceName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  //Password Generator settings
  const [showPassGen, setShowPassGen] = useState<boolean>(false);
  const [length, setLength] = useState<number>(8);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSpecialChars, setUseSpecialChars] = useState<boolean>(true);

  const generatePassword = useCallback(async () => {
    const result = await passwordService.generatePassword({
      length,
      useUppercase,
      useNumbers,
      useSpecialChars,
    });
    if (result.status === "success") setPassword(result.data);
  }, [length, useUppercase, useNumbers, useSpecialChars]);

  useEffect(() => {
    const textFieldsCheck = async () => {
      if (serviceName && login && password) setButtonDisabled(false);
    };

    textFieldsCheck();
  }, [serviceName, login, password]);

  useEffect(() => {
    const setInitialPassword = async () => {
      if (initialPassword) {
        setServiceName(initialPassword.serviceName);
        setUrl(initialPassword.url || "");
        setLogin(initialPassword.login);
        setPassword(initialPassword.password);
        setCategory(initialPassword.category || "");
        setNotes(initialPassword.notes || "");
      }
    };

    setInitialPassword();
  }, [initialPassword]);

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
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-xl font-medium dark:text-white ">
          {title}
        </div>
        <div className="px-6 py-4 space-y-4 border-b border-gray-200 dark:border-gray-700 overflow-auto">
          <TextField
            id="service"
            label="Название сервиса *"
            value={serviceName}
            onChange={(e) => {
              setServiceName(e.target.value);
            }}
            placeholder="Например: Google"
            minLength={2}
            maxLength={100}
            errors={
              errors && !Array.isArray(errors) ? errors.ServiceName : undefined
            }
          />
          <TextField
            id="url"
            label="URL"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            placeholder="https://example.com"
            type="url"
            minLength={2}
            maxLength={500}
            errors={errors && !Array.isArray(errors) ? errors.Url : undefined}
          />
          <TextField
            id="login"
            label="Логин/Email *"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
            }}
            placeholder="user@example.com"
            type="text"
            minLength={2}
            maxLength={100}
            errors={errors && !Array.isArray(errors) ? errors.Login : undefined}
          />
          <div className="relative">
            <PasswordField
              id="password"
              label="Пароль *"
              icon={false}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              minLength={4}
              maxLength={500}
              errors={
                errors && !Array.isArray(errors) ? errors.Password : undefined
              }
            />
            <TextButton
              label="Генератор паролей"
              icon={<KeyRound />}
              onClick={() => {
                setShowPassGen(!showPassGen);
              }}
              className="absolute right-0 top-0 text-sm"
            />
          </div>
          {showPassGen && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
              <Range
                id="length"
                label="Длина пароля"
                value={length}
                min={8}
                max={32}
                onChange={(e) => {
                  setLength(Number.parseInt(e.target.value));
                }}
              />
              <div className="space-y-2">
                <Checkbox
                  label="A-Z (заглавные буквы)"
                  value={useUppercase}
                  onChange={() => {
                    setUseUppercase(!useUppercase);
                  }}
                />
                <Checkbox
                  label="0-9 (цифры)"
                  value={useNumbers}
                  onChange={() => {
                    setUseNumbers(!useNumbers);
                  }}
                />
                <Checkbox
                  label="!@#$%... (спецсимволы)"
                  value={useSpecialChars}
                  onChange={() => {
                    setUseSpecialChars(!useSpecialChars);
                  }}
                />
              </div>
              <Button
                title="Сгенерировать и подставить"
                onClick={() => {
                  generatePassword();
                }}
              />
            </div>
          )}
          <TextField
            id="category"
            label="Категория"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            placeholder="Личное"
            type="text"
            maxLength={50}
            errors={
              errors && !Array.isArray(errors) ? errors.Category : undefined
            }
          />
          <TextArea
            id="note"
            label="Примечание"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            placeholder="Дополнительная информация..."
            maxLength={1000}
            errors={errors && !Array.isArray(errors) ? errors.Notes : undefined}
          />
        </div>
        <div className="px-6 py-4 flex justify-end gap-2">
          <AccentButton title="Отмена" onClick={onClose} className="w-30" />
          <Button
            title="Сохранить"
            disabled={buttonDisabled}
            onClick={() => {
              const data: Password = {
                ...(initialPassword && { id: initialPassword.id }),
                serviceName,
                login,
                password,
                ...(category && { category }),
                ...(notes && { notes }),
                ...(url && { url }),
              };
              onSave(data);
            }}
            className="w-30"
          />
        </div>
      </div>
    </div>
  );
}

export default PasswordModal;
