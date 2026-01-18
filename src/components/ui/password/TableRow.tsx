import {
  SquareArrowOutUpRight,
  Eye,
  Copy,
  Pencil,
  Trash2,
  EyeOff,
  X,
} from "lucide-react";
import { type Password } from "../../../services/api/passwordService";
import { useState } from "react";

interface TableRowProps {
  password: Password;
  onDelete: () => void;
  onEdit: () => void;
}

function TableRow({ password, onDelete, onEdit }: TableRowProps) {
  const [copiedLogin, setCopiedLogin] = useState<string>(password.login);
  const [copiedPassword, setCopiedPassword] = useState<string>(
    password.password
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800">
      <td className="px-6 py-2">
        <div className="text-gray-900 dark:text-white">
          {password.serviceName}
        </div>
      </td>
      <td className="px-6 py-2">
        <div className="text-gray-600 dark:text-gray-300 p-2 flex items-center gap-1 justify-between">
          {copiedLogin}
          <button
            className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            title="Скопировать"
            onClick={() => {
              navigator.clipboard.writeText(password.login);
              const value = password.login;
              setCopiedLogin("Скопировано!");
              setTimeout(() => {
                setCopiedLogin(value);
              }, 300);
            }}
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </td>
      <td className="px-6 py-2 ">
        <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1 justify-between">
          {showPassword
            ? copiedPassword
            : copiedPassword === "Скопировано!"
            ? copiedPassword
            : "•".repeat(password.password.length)}
          <div className="">
            <button
              className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              title="Показать пароль"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            <button
              className="cursor-pointer p-2  hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              title="Скопировать"
              onClick={() => {
                navigator.clipboard.writeText(password.password);
                const value = password.password;
                setCopiedPassword("Скопировано!");
                setTimeout(() => {
                  setCopiedPassword(value);
                }, 300);
              }}
            >
              <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </td>
      <td className="px-6 py-2">
        <div className="flex items-center ">
          {password.url ? (
            <a href={password.url} target="_blank">
              <SquareArrowOutUpRight className="w-5 h-5 text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-500 cursor-pointer" />
            </a>
          ) : (
            <X className="w-5 h-5 text-red-600" />
          )}
        </div>
      </td>
      <td className="px-6 py-2">
        {password.category ? (
          <div className="bg-blue-100 dark:bg-blue-900 dark:text-blue-400 inline rounded-full px-2 py-1 text-xs text-blue-600">
            {password.category}
          </div>
        ) : (
          <X className="w-5 h-5 text-red-600" />
        )}
      </td>
      <td className="px-6 py-2">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {password.updatedAt &&
            new Date(password.updatedAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-2">
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg"
            title="Редактировать"
            onClick={onEdit}
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            title="Удалить"
            onClick={onDelete}
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TableRow;
