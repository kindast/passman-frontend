import Button from "../components/ui/Button";
import PasswordField from "../components/ui/PasswordField";
import TextButton from "../components/ui/TextButton";
import useAuthStore from "../store/authStore";
import { Mail, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { authService } from "../api/services/authService";
import TextField from "../components/ui/TextField";
import type { SignUpDto } from "../api/dto/auth";

type SignUpValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpErrors = Partial<Record<keyof SignUpValues, string>>;

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,100}$/;

function validate(values: SignUpValues): SignUpErrors {
  const errors: SignUpErrors = {};

  const email = values.email.trim();
  if (!email) errors.email = "Email обязателен";
  else if (email.length > 100) errors.email = "Email: максимум 100 символов";
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = "Неверный формат email";
  }

  const password = values.password;
  if (!password) errors.password = "Пароль обязателен";
  else if (password.length < 8) errors.password = "Пароль минимум 8 символов";
  else if (password.length > 100)
    errors.password = "Пароль: максимум 100 символов";
  else if (!passwordRegex.test(password)) {
    errors.password =
      "Пароль должен содержать: заглавную букву, строчную букву, цифру, специальный символ";
  }

  const confirmPassword = values.confirmPassword;
  if (!confirmPassword)
    errors.confirmPassword = "Подтверждение пароля обязательно";
  else if (confirmPassword !== password)
    errors.confirmPassword = "Пароли не совпадают";

  return errors;
}

function SignUpScreen() {
  const [values, setValues] = useState<SignUpValues>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState<{
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const errors = useMemo(() => validate(values), [values]);

  const signUp = useCallback(async () => {
    const data: SignUpDto = { email: values.email, password: values.password };
    await authService.signUp(data);
  }, [values]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white dark:text-gray-800" />
            </div>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">
              Регистрация
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Создайте аккаунт PassMan
            </p>
          </div>
          <div className="space-y-4">
            <TextField
              id="email"
              label="Email"
              value={values.email}
              onChange={(e) =>
                setValues((v) => ({ ...v, email: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="example@email.com"
              icon={<Mail />}
              errors={touched.email ? (errors.email ?? "") : ""}
            />
            <PasswordField
              id="password"
              label="Пароль"
              value={values.password}
              onChange={(e) =>
                setValues((v) => ({ ...v, password: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              errors={touched.password ? (errors.password ?? "") : ""}
            />
            <PasswordField
              id="confirmPassword"
              label="Подтверждение пароля"
              value={values.confirmPassword}
              onChange={(e) =>
                setValues((v) => ({ ...v, confirmPassword: e.target.value }))
              }
              onBlur={() =>
                setTouched((t) => ({ ...t, confirmPassword: true }))
              }
              errors={
                touched.confirmPassword ? (errors.confirmPassword ?? "") : ""
              }
            />
            <div className="p-3 bg-blue-50 dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                Требования к паролю:
              </p>
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-0.5">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  Минимум 8 символов
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  Хотя бы одна цифра
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  Хотя бы одна заглавная буква
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  Хотя бы одна строчная буква
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  Хотя бы один специальный символ
                </li>
              </ul>
            </div>
            <Button
              title="Создать аккаунт"
              disabled={
                Object.keys(errors).length !== 0 &&
                (touched.confirmPassword || touched.password || touched.email)
              }
              onClick={() => {
                if (Object.keys(errors).length !== 0) return;
                signUp();
              }}
            />
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                Уже есть аккаунт?{" "}
                <TextButton
                  label="Войти"
                  onClick={() => {
                    navigate("/login");
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpScreen;
