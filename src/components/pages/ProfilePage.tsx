import { useCallback, useEffect, useState } from "react";
import type { RequestState } from "../../services/api/api";
import {
  userService,
  type ChangePasswordRequest,
  type Profile,
} from "../../services/api/userService";
import TextField from "../ui/TextField";
import AccentButton from "../ui/AccentButton";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import DeleteModal from "../ui/DeleteModal";
import useAuthStore from "../../store/authStore";
import ChangePasswordModal from "../ui/ChangePasswordModal";

function ProfilePage() {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const [showChangePasswordModal, setShowChangePasswordModal] =
    useState<boolean>(false);
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errors, setErrors] = useState<string[]>();
  const [profile, setProfile] = useState<RequestState<Profile>>({
    status: "loading",
  });

  const deleteAccount = useCallback(async () => {
    const result = await userService.deleteAccount(passwordConfirm);
    if (result.status === "success") useAuthStore.getState().clearAuth();
    if (result.status === "error") setErrors(result.errors);
  }, [passwordConfirm]);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const data: ChangePasswordRequest = {
        currentPassword,
        newPassword,
      };
      const result = await userService.changePassword(data);
      if (result.status === "success") setShowChangePasswordModal(false);
      if (result.status === "error") setErrors(result.errors);
    },
    []
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await userService.profile();
      if (result.status === "success") setProfile(result);
    };

    fetchProfile();
  }, []);

  if (profile.status === "loading")
    return <Loading title="Загрузка профиля..." />;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 grow flex  justify-center">
      <div className="w-1/2 space-y-6">
        <p className="text-2xl text-gray-900 dark:text-white font-medium">
          Профиль пользователя
        </p>
        <div className="border border-gray-200 dark:bg-gray-800 dark:border-gray-300 p-6 rounded-xl bg-white space-y-4">
          <p className="font-medium text-gray-900 dark:text-white text-xl">
            Основная информация
          </p>
          {profile.status === "success" && (
            <>
              <div className="flex items-end gap-4">
                <TextField
                  id="email"
                  label="Email"
                  value={
                    profile.status === "success"
                      ? profile.data.email
                      : "Загрузка..."
                  }
                  readonly
                  placeholder="user@example.com"
                  type="email"
                  className="grow"
                />
                <AccentButton
                  title="Изменить"
                  onClick={() => {}}
                  className="w-25"
                  disabled
                />
              </div>
              <TextField
                id="created"
                label="Дата регистрации"
                readonly
                value={
                  profile
                    ? new Date(
                        profile.status === "success"
                          ? profile.data.createdAt
                          : ""
                      ).toLocaleDateString()
                    : "Загрузка..."
                }
              />
            </>
          )}
        </div>
        <div className="border border-gray-200 dark:bg-gray-800 dark:border-gray-300 p-6 rounded-xl bg-white space-y-4">
          <p className="font-medium text-gray-900 dark:text-white text-xl">
            Безопасность
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between rounded-xl">
            <div>
              <p className="font-medium dark:text-gray-300">Главный пароль</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Последнее изменение:{" "}
                {profile
                  ? new Date(
                      profile.status === "success" ? profile.data.createdAt : ""
                    ).toLocaleDateString()
                  : "Загрузка..."}
              </p>
            </div>
            <Button
              title="Изменить главный пароль"
              onClick={() => {
                setShowChangePasswordModal(true);
              }}
              className="w-60"
            />
          </div>
        </div>
        <div className="border-red-200 dark:border-red-900 border-2 p-6 rounded-xl bg-white dark:bg-gray-800 space-y-4">
          <div className="rounded-xl bg-red-50 dark:bg-red-950 p-6 space-y-4">
            <p className="font-medium text-lg text-gray-900 dark:text-gray-300">
              Удалить аккаунт
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              После удаления аккаунта все ваши данные будут безвозвратно
              удалены. Это действие нельзя отменить.
            </p>
            <Button
              title="Удалить аккаунт"
              onClick={() => {
                setShowConfirmDeleteModal(true);
              }}
              color="red"
              className="w-1/3 bg-red-600 hover:bg-red-700 rounded-xl"
            />
          </div>
        </div>
      </div>
      {showConfirmDeleteModal && (
        <DeleteModal
          title="Удаление аккаунта"
          text="Вы уверены, что хотите навсегда удалить свой аккаунт?
          ⚠️ Все данные (пароли, заметки, настройки) будут безвозвратно удалены.
            ⚠️ Действие нельзя отменить после подтверждения.
Если вы уверены введите пароль"
          onClose={() => setShowConfirmDeleteModal(false)}
          onDelete={() => {
            deleteAccount();
          }}
          password={passwordConfirm}
          onChangePassword={(e) => setPasswordConfirm(e.target.value)}
          errors={errors}
        />
      )}
      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          onChange={(currentPassword, newPassword) => {
            changePassword(currentPassword, newPassword);
          }}
          errors={errors}
        />
      )}
    </div>
  );
}

export default ProfilePage;
