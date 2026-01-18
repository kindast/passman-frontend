import Button from "../components/ui/Button";
import PasswordField from "../components/ui/PasswordField";
import Checkbox from "../components/ui/Checkbox";
import TextButton from "../components/ui/TextButton";
import { useCallback, useEffect, useState } from "react";
import { authService, type AuthRequest } from "../services/api/authService";
import { useNavigate } from "react-router";
import { Lock, Mail } from "lucide-react";
import useAuthStore from "../store/authStore";
import TextField from "../components/ui/TextField";

type FormErrors = { Email: string[]; MasterPassword: string[] };

function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [masterPassword, setMasterPassword] = useState<string>("");
  const [rememberMe, setRemeberMe] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[] | FormErrors>();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(async () => {
    const data: AuthRequest = {
      email,
      masterPassword,
    };
    localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
    const result = await authService.login(data);
    if (result.status === "error") setErrors(result.errors);
  }, [email, masterPassword, rememberMe]);

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
            <Checkbox
              label="Запомнить меня"
              value={rememberMe}
              onChange={() => {
                setRemeberMe(!rememberMe);
              }}
            />
            <Button
              title="Войти"
              onClick={() => {
                login();
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

export default LoginScreen;
