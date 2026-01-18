import Button from "../components/ui/Button";
import PasswordField from "../components/ui/PasswordField";
import TextButton from "../components/ui/TextButton";
import useAuthStore from "../store/authStore";
import { Mail, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { authService, type AuthRequest } from "../services/api/authService";
import TextField from "../components/ui/TextField";

type FormErrors = { Email: string[]; MasterPassword: string[] };

function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [masterPassword, setMasterPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[] | FormErrors>();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const register = useCallback(async () => {
    const data: AuthRequest = { email, masterPassword };
    const result = await authService.register(data);

    if (result.status === "error") setErrors(result.errors);
  }, [email, masterPassword]);

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              icon={<Mail />}
              errors={
                errors && !Array.isArray(errors) ? errors.Email : undefined
              }
            />
            <PasswordField
              id="password"
              label="Пароль"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              errors={
                errors && !Array.isArray(errors)
                  ? errors.MasterPassword
                  : undefined
              }
            />
            <PasswordField
              id="confirmPassword"
              label="Подтверждение пароля"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              errors={
                masterPassword !== confirmPassword
                  ? ["Пароли не совпадают"]
                  : undefined
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
              onClick={() => {
                if (masterPassword !== confirmPassword) return;
                register();
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

export default RegisterScreen;
