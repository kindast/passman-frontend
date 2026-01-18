import useAuthStore from "../store/authStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/api/authService";
import {
  ChevronDown,
  Lock,
  LogOut,
  Menu,
  Settings,
  User,
  Plus,
  Search,
  SearchAlert,
  ArrowUp,
  ArrowDown,
  List,
  Grid,
} from "lucide-react";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import AccentButton from "../components/ui/AccentButton";
import TableRow from "../components/ui/password/TableRow";
import {
  passwordService,
  type GetPasswordsResponse,
  type Password,
} from "../services/api/passwordService";
import Loading from "../components/ui/Loading";
import type { RequestState } from "../services/api/api";
import PasswordModal from "./PasswordModal";
import ProfilePage from "../components/pages/ProfilePage";
import DeleteModal from "../components/ui/DeleteModal";
import Card from "../components/ui/password/Card";
import type { SelectValue } from "../components/ui/Select";

function DashboardScreen() {
  const categories: SelectValue[] = useMemo(
    () => [
      { id: "all", label: "Все пароли" },
      { id: "personal", label: "Личное" },
      { id: "work", label: "Работа" },
      { id: "finance", label: "Финансы" },
      { id: "social", label: "Соцсети" },
      { id: "other", label: "Другое" },
    ],
    [],
  );
  const { userEmail } = useAuthStore();
  const [category, setCategory] = useState<SelectValue>({
    id: "all",
    label: "Все пароли",
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSideBar, setShowSideBar] = useState<boolean>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSortModal, setShowSortModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showDeletePasswordModal, setShowDeletePasswordModal] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [search, setSearch] = useState<string>("");
  const [passwords, setPasswords] = useState<
    RequestState<GetPasswordsResponse>
  >({ status: "loading" });
  const [passwordForEdit, setPasswordForEdit] = useState<Password>();
  const [passwordForDelete, setPasswordForDelete] = useState<Password>();

  const [page, setPage] = useState<number>(1);
  const [sortUp, setSortUp] = useState<boolean>(true);
  const [sort, setSort] = useState<string>("name");

  const fetchPasswords = useCallback(async () => {
    setPasswords({ status: "loading" });
    const params = {
      page,
      pageSize: 10,
      ...(search && { search }),
      sort: !sortUp ? sort + "Desc" : sort,
      category: category.id,
    };
    const result = await passwordService.getPasswords(params);
    setPasswords(result);
  }, [page, search, sort, sortUp, category]);

  const deletePassword = useCallback(
    async (id: string) => {
      const result = await passwordService.deletePassword(id);
      if (result.status === "success") fetchPasswords();
    },
    [fetchPasswords],
  );

  const addPassword = useCallback(
    async (password: Password) => {
      const result = await passwordService.addPassword(password);
      if (result.status === "success") {
        fetchPasswords();
        setShowPasswordModal(false);
      }
      if (result.status === "error") setErrors(result.errors);
    },
    [fetchPasswords],
  );

  const editPassword = useCallback(
    async (password: Password) => {
      const result = await passwordService.updatePassword(password);
      if (result.status === "success") {
        fetchPasswords();
        setShowPasswordModal(false);
        setPasswordForEdit(undefined);
      }
      if (result.status === "error") setErrors(result.errors);
    },
    [fetchPasswords],
  );

  const getPages = useCallback(() => {
    if (passwords.status !== "success") return [];
    const totalPages = passwords.data.totalPages;

    if (!totalPages || totalPages <= 0) return [];

    if (totalPages === 1) return [1];

    if (page === 1) return totalPages === 2 ? [1, 2] : [1, 2, 3];

    if (page === totalPages)
      return totalPages === 2
        ? [1, 2]
        : [totalPages - 2, totalPages - 1, totalPages];

    return [page - 1, page, page + 1];
  }, [passwords, page]);

  useEffect(() => {
    const delay = search ? 300 : 0;

    const handler = setTimeout(() => {
      fetchPasswords();
    }, delay);

    return () => clearTimeout(handler);
  }, [fetchPasswords, search]);

  useEffect(() => {
    const loadSettings = async () => {
      if (showSideBar === undefined) {
        setShowSideBar(
          JSON.parse(localStorage.getItem("showSideBar") || "true"),
        );
      }
      localStorage.setItem("showSideBar", JSON.stringify(showSideBar));
    };

    loadSettings();
  }, [showSideBar]);

  return (
    <div
      className="w-full min-h-screen flex dark:bg-gray-800"
      onClick={() => {
        setShowModal(false);
        setShowSortModal(false);
      }}
    >
      {showDeletePasswordModal && passwordForDelete && (
        <DeleteModal
          title="Удалить пароль"
          text="Вы уверены, что хотите удалить этот пароль?"
          onClose={() => {
            setShowDeletePasswordModal(false);
          }}
          onDelete={() => {
            if (passwordForDelete?.id) {
              deletePassword(passwordForDelete.id);
              setPasswordForDelete(undefined);
            }
          }}
        />
      )}
      {showPasswordModal === true ? (
        <PasswordModal
          title={passwordForEdit ? "Редактировать пароль" : "Добавить пароль"}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordForEdit(undefined);
          }}
          onSave={(password: Password) => {
            if (!passwordForEdit) addPassword(password);
            if (passwordForEdit) editPassword(password);
            setErrors(undefined);
          }}
          initialPassword={passwordForEdit || undefined}
          errors={errors}
        />
      ) : (
        ""
      )}
      <div
        className={`border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden ${
          showSideBar ? "w-64" : "w-0"
        }`}
      >
        <div className="w-56">
          <div className="p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex justify-center items-center">
              <Lock className="w-6 h-6 text-white dark:text-gray-800" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium text-xl">
              PassMan
            </p>
          </div>

          <div className="p-4 space-y-1 border-b border-gray-200 dark:border-gray-700 select-none">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={
                  category.id === cat.id && !showSettings
                    ? "text-indigo-600 bg-indigo-50 dark:bg-gray-700 dark:text-gray-300 cursor-pointer px-4 py-2 font-medium rounded-lg"
                    : "text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-300 cursor-pointer px-4 py-2 font-medium rounded-lg"
                }
                onClick={() => {
                  setShowSettings(false);
                  setCategory(cat);
                }}
              >
                {cat.label}
              </div>
            ))}
          </div>

          <div className="p-4 select-none">
            <div
              className={
                showSettings
                  ? "text-indigo-600 bg-indigo-50 dark:bg-gray-700 dark:text-gray-300 cursor-pointer px-4 py-2 font-medium rounded-lg flex items-center gap-2"
                  : "text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-300 cursor-pointer px-4 py-2 font-medium rounded-lg flex items-center gap-2"
              }
              onClick={() => {
                setShowSettings(true);
              }}
            >
              <Settings className="w-4 h-4" />
              Настройки
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg cursor-pointer"
              onClick={() => {
                setShowSideBar(!showSideBar);
              }}
            >
              <Menu className="w-5 h-5" />
            </div>
            <p className="font-medium text-xl text-gray-900 dark:text-white">
              Менеджер паролей
            </p>
          </div>
          <div
            className="relative select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => setShowModal(!showModal)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
            >
              <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                {userEmail}
              </p>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className={
                showModal
                  ? "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                  : "hidden"
              }
            >
              <div
                className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setShowSettings(true);
                  setShowModal(false);
                }}
              >
                <User className="w-4 h-4" />
                Профиль
              </div>
              <div
                className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  authService.logout();
                }}
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </div>
            </div>
          </div>
        </div>
        {!showSettings ? (
          <>
            {passwords.status === "success" && passwords.statusCode === 204 ? (
              <div className="flex flex-col justify-center items-center flex-1 p-6 bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-1/3 p-6">
                  <p className="text-gray-900 dark:text-white text-xl font-medium">
                    Добро пожаловать!
                  </p>
                  <br />
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    У вас ещё нет ни одного сохранённого пароля. <br />
                    Нажмите кнопку ниже, чтобы добавить свой первый пароль.
                  </p>
                  <Button
                    title="Добавить пароль"
                    onClick={() => setShowPasswordModal(true)}
                    icon={<Plus />}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 dark:bg-gray-800 ">
                <div className="border-b border-gray-200 dark:border-gray-700  px-6 py-4 flex items-center gap-2">
                  <TextField
                    id="search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    className="grow-6"
                    placeholder="Поиск по названию..."
                    icon={<Search />}
                  />
                  <div className="flex gap-2">
                    <div
                      className="border border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-lg cursor-pointer p-3 text-gray-600 dark:text-gray-300"
                      onClick={() => setSortUp(!sortUp)}
                    >
                      {sortUp ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className="relative select-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        onClick={() => setShowSortModal(!showSortModal)}
                        className="cursor-pointer relative"
                      >
                        <TextField
                          id="sort"
                          readonly
                          value={
                            sort === "name" ? "По имени" : "По дате изменения"
                          }
                          className="text-gray-600 dark:text-gray-300 select-none"
                        />
                        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={
                          showSortModal
                            ? "absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                            : "hidden"
                        }
                      >
                        <div
                          className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setSort("name");
                            setShowSortModal(false);
                          }}
                        >
                          По имени
                        </div>
                        <div
                          className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setSort("updated");
                            setShowSortModal(false);
                          }}
                        >
                          По дате изменения
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex items-center border dark:border-gray-600 border-gray-300 rounded-lg overflow-hidden`}
                  >
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-3 cursor-pointer ${viewMode === "grid" ? "dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-900" : "dark:text-gray-400 dark:hover:text-gray-300 text-gray-600 hover:text-gray-900"} transition-colors`}
                      title="Карточки"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-3 cursor-pointer ${viewMode === "table" ? "dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-900" : "dark:text-gray-400 dark:hover:text-gray-300 text-gray-600 hover:text-gray-900"} transition-colors`}
                      title="Таблица"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grow">
                    <Button
                      title="Добавить пароль"
                      onClick={() => setShowPasswordModal(true)}
                      icon={<Plus />}
                    />
                  </div>
                </div>
                {passwords.status === "loading" && (
                  <Loading title="Загрузка паролей..." />
                )}
                {passwords.status === "error" &&
                  passwords.statusCode === 400 && (
                    <div className="flex flex-col flex-1">
                      <div className="p-6 bg-gray-50 dark:bg-gray-900 flex-1">
                        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                          <SearchAlert className="w-20 h-20 text-gray-600 dark:text-gray-300" />
                          <p className="text-xl text-gray-600 dark:text-gray-300">
                            {search !== ""
                              ? `Данные по запросу "${search}" не найдены!`
                              : "В данной категории нет паролей"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                {passwords.status === "success" && (
                  <>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 flex-1">
                      {viewMode === "table" ? (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 text-sm">
                                  Сервис
                                </th>
                                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
                                  Логин
                                </th>
                                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
                                  Пароль
                                </th>
                                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
                                  URL
                                </th>
                                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
                                  Категория
                                </th>
                                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
                                  Обновлен
                                </th>
                                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
                                  Действия
                                </th>
                              </tr>
                            </thead>
                            <tbody className="border-t border-gray-200 dark:border-gray-700">
                              {passwords.data.data.map((password) => {
                                return (
                                  <TableRow
                                    key={password.id}
                                    password={{
                                      id: password.id,
                                      serviceName: password.serviceName,
                                      url: password.url,
                                      login: password.login,
                                      password: password.password,
                                      category: password.category,
                                      updatedAt: password.updatedAt,
                                    }}
                                    onDelete={() => {
                                      setPasswordForDelete(password);
                                      setShowDeletePasswordModal(true);
                                    }}
                                    onEdit={() => {
                                      if (password) {
                                        setPasswordForEdit(password);
                                        setShowPasswordModal(true);
                                      }
                                    }}
                                  />
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {passwords.data.data.map((password) => {
                            return (
                              <Card
                                key={password.id}
                                password={password}
                                onDelete={() => {
                                  setPasswordForDelete(password);
                                  setShowDeletePasswordModal(true);
                                }}
                                onEdit={() => {
                                  if (password) {
                                    setPasswordForEdit(password);
                                    setShowPasswordModal(true);
                                  }
                                }}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {getPages().length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                        <p className="text-gray-600 dark:text-gray-300  text-sm">
                          Показано {passwords.data.data.length} из{" "}
                          {passwords.data.totalCount}
                        </p>
                        <div className="flex gap-2">
                          <AccentButton
                            title="< Назад"
                            onClick={() => {
                              setPage(page - 1);
                            }}
                            className="w-25 h-10 text-sm"
                            disabled={page === 1}
                          />
                          {getPages().map((pageNum) => {
                            return (
                              <button
                                key={pageNum}
                                className={`w-10 h-10 font-medium rounded-lg transition-colors cursor-pointer 
                      ${
                        page === pageNum
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                      }`}
                                onClick={() => {
                                  setPage(pageNum);
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          <AccentButton
                            title="Вперед >"
                            onClick={() => {
                              setPage(page + 1);
                            }}
                            className="w-25 h-10 text-sm"
                            disabled={page === passwords.data.totalPages}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <ProfilePage />
        )}
      </div>
    </div>
  );
}

export default DashboardScreen;
