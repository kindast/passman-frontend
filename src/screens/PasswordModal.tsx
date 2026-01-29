import { KeyRound } from "lucide-react";
import AccentButton from "../components/ui/AccentButton";
import Button from "../components/ui/Button";
import PasswordField from "../components/ui/PasswordField";
import TextArea from "../components/ui/TextArea";
import TextButton from "../components/ui/TextButton";
import TextField from "../components/ui/TextField";
import Checkbox from "../components/ui/Checkbox";
import { useCallback, useEffect, useMemo, useState } from "react";
import Range from "../components/ui/Range";
import Select, { type SelectValue } from "../components/ui/Select";
import type { PasswordDto } from "../api/dto/password/password.dto";
import { passwordService } from "../api/services/passwordService";
import FileInput from "../components/ui/FileInput";
import { coverService } from "../api/services/coverService";

type CreatePasswordValues = {
  serviceName: string;
  url: string;
  login: string;
  password: string;
  category: SelectValue;
  notes: string;
};

type Errors = Partial<Record<keyof CreatePasswordValues, string>>;
const serviceNameRegex = /^[a-zA-Z0-9\s\-.]+$/;

function validate(v: CreatePasswordValues): Errors {
  const e: Errors = {};

  // ServiceName
  const serviceName = v.serviceName.trim();
  if (!serviceName) e.serviceName = "Название сервиса обязательно";
  else if (serviceName.length < 2)
    e.serviceName = "Название: минимум 2 символа";
  else if (serviceName.length > 100)
    e.serviceName = "Название: максимум 100 символов";
  else if (!serviceNameRegex.test(serviceName))
    e.serviceName = "Только буквы, цифры, пробелы, дефис, точка";

  // Url (не required)
  const url = v.url.trim();
  if (url.length > 500) e.url = "URL: максимум 500 символов";

  // Login
  const login = v.login.trim();
  if (!login) e.login = "Логин обязателен";
  else if (login.length < 2) e.login = "Логин: минимум 2 символа";
  else if (login.length > 100) e.login = "Логин: максимум 100 символов";

  // Password
  const password = v.password;
  if (!password) e.password = "Пароль обязателен";
  else if (password.length < 4) e.password = "Пароль: минимум 4 символа";
  else if (password.length > 500) e.password = "Пароль: максимум 500 символов";

  // Notes (не required)
  const notes = v.notes;
  if (notes.length > 1000) e.notes = "Заметки: максимум 1000 символов";

  return e;
}

interface PasswordModalProps {
  title: string;
  initialPassword?: PasswordDto;
  onClose: () => void;
  onSave: (password: PasswordDto) => void;
}

function PasswordModal({
  title,
  initialPassword,
  onClose,
  onSave,
}: PasswordModalProps) {
  const categories: SelectValue[] = useMemo(
    () => [
      { id: "personal", label: "Личное" },
      { id: "work", label: "Работа" },
      { id: "finance", label: "Финансы" },
      { id: "social", label: "Соцсети" },
      { id: "other", label: "Другое" },
    ],
    [],
  );
  const [values, setValues] = useState<CreatePasswordValues>({
    serviceName: "",
    url: "",
    login: "",
    password: "",
    category: { id: "personal", label: "Личное" },
    notes: "",
  });

  const [touched, setTouched] = useState<
    Record<keyof CreatePasswordValues, boolean>
  >({
    serviceName: false,
    url: false,
    login: false,
    password: false,
    category: false,
    notes: false,
  });

  const errors = useMemo(() => validate(values), [values]);

  const [cover, setCover] = useState<File | null>();

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
    if (result.state === "success")
      setValues((p) => {
        return { ...p, password: result.data.message };
      });
  }, [length, useUppercase, useNumbers, useSpecialChars]);

  const uploadCover = useCallback(async () => {
    if (!cover) return;
    const data: FormData = new FormData();
    data.append("file", cover);
    const result = await coverService.uploadCover(data);
    if (result.state === "success") {
      const id = result.data.id;
      const data: PasswordDto = {
        ...(initialPassword && { id: initialPassword.id }),
        serviceName: values.serviceName,
        login: values.login,
        password: values.password,
        category: values.category.id,
        ...(values.notes && { notes: values.notes }),
        ...(values.url && { url: values.url }),
        ...(id && { cover: id }),
      };
      onSave(data);
    }
  }, [
    cover,
    initialPassword,
    values.serviceName,
    values.login,
    values.password,
    values.category.id,
    values.notes,
    values.url,
    onSave,
  ]);

  useEffect(() => {
    const setInitialPassword = async () => {
      if (initialPassword) {
        setValues({
          serviceName: initialPassword.serviceName,
          url: initialPassword.url || "",
          login: initialPassword.login,
          password: initialPassword.password,
          notes: initialPassword.notes || "",
          category: categories.find(
            (c) => c.label === initialPassword.category,
          ) || {
            id: "personal",
            label: "Личное",
          },
        });
      }
    };

    setInitialPassword();
  }, [categories, initialPassword]);

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
            value={values.serviceName}
            onChange={(e) =>
              setValues((v) => ({ ...v, serviceName: e.target.value }))
            }
            onBlur={() => setTouched((t) => ({ ...t, serviceName: true }))}
            placeholder="Например: Google"
            minLength={2}
            maxLength={100}
            errors={touched.serviceName ? (errors.serviceName ?? "") : ""}
          />
          <TextField
            id="url"
            label="URL"
            value={values.url}
            onChange={(e) => setValues((v) => ({ ...v, url: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, url: true }))}
            placeholder="https://example.com"
            type="url"
            minLength={2}
            maxLength={500}
            errors={touched.url ? (errors.url ?? "") : ""}
          />
          <TextField
            id="login"
            label="Логин/Email *"
            value={values.login}
            onChange={(e) =>
              setValues((v) => ({ ...v, login: e.target.value }))
            }
            onBlur={() => setTouched((t) => ({ ...t, login: true }))}
            placeholder="user@example.com"
            type="text"
            minLength={2}
            maxLength={100}
            errors={touched.login ? (errors.login ?? "") : ""}
          />
          <div className="relative">
            <PasswordField
              id="password"
              label="Пароль *"
              icon={false}
              value={values.password}
              onChange={(e) =>
                setValues((v) => ({ ...v, password: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              minLength={4}
              maxLength={500}
              errors={touched.password ? (errors.password ?? "") : ""}
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
          <Select
            label="Категория *"
            values={categories}
            selectedValue={values.category}
            onChange={(c) => setValues((v) => ({ ...v, category: c }))}
          />
          <FileInput
            label="Изображение"
            preview={true}
            value={cover}
            onChange={(f) => setCover(f)}
          />
          <TextArea
            id="note"
            label="Примечание"
            value={values.notes}
            onChange={(e) =>
              setValues((v) => ({ ...v, notes: e.target.value }))
            }
            onBlur={() => setTouched((t) => ({ ...t, notes: true }))}
            placeholder="Дополнительная информация..."
            maxLength={1000}
            errors={touched.notes ? (errors.notes ?? "") : ""}
          />
        </div>
        <div className="px-6 py-4 flex justify-end gap-2">
          <AccentButton title="Отмена" onClick={onClose} className="w-30" />
          <Button
            title="Сохранить"
            disabled={Object.keys(errors).length !== 0}
            onClick={() => {
              if (cover) {
                uploadCover();
                return;
              }
              const data: PasswordDto = {
                ...(initialPassword && { id: initialPassword.id }),
                serviceName: values.serviceName,
                login: values.login,
                password: values.password,
                category: values.category.id,
                ...(values.notes && { notes: values.notes }),
                ...(values.url && { url: values.url }),
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
