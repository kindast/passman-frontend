import Button from "../components/ui/Button";
import PasswordField from "../components/ui/PasswordField";
import Checkbox from "../components/ui/Checkbox";
import TextButton from "../components/ui/TextButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../api/services/authService";
import { useNavigate } from "react-router";
import { Lock, Mail } from "lucide-react";
import useAuthStore from "../store/authStore";
import TextField from "../components/ui/TextField";
import type { SignInDto } from "../api/dto/auth";

type SignInValues = {
  email: string;
  password: string;
};

type SignUpErrors = Partial<Record<keyof SignInValues, string>>;

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,100}$/;

function validate(values: SignInValues): SignUpErrors {
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

  return errors;
}

function SignInScreen() {
  const [values, setValues] = useState<SignInValues>({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });
  const errors = useMemo(() => validate(values), [values]);
  const [rememberMe, setRemeberMe] = useState<boolean>(true);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const signIn = useCallback(async () => {
    const data: SignInDto = {
      email: values.email,
      password: values.password,
    };
    localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
    await authService.signIn(data);
  }, [values, rememberMe]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-4 ">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white dark:text-gray-800" />
            </div>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">
              PassMan
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Менеджер паролей</p>
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
            <Checkbox
              label="Запомнить меня"
              value={rememberMe}
              onChange={() => {
                setRemeberMe(!rememberMe);
              }}
            />
            <Button
              title="Войти"
              disabled={
                Object.keys(errors).length !== 0 &&
                (touched.password || touched.email)
              }
              onClick={() => {
                signIn();
              }}
            />
            {errors && Array.isArray(errors) && (
              <div className=" rounded-xl py-2 text-xs text-red-600">
                {errors.map((value, index) => {
                  return <p key={index}>{value}</p>;
                })}
              </div>
            )}
            <div className="text-center pt-4 text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
              Нет аккаунта?{" "}
              <TextButton
                label="Зарегистрироваться"
                onClick={() => {
                  navigate("/register");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInScreen;
