import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,100}$/; // как в бэкенде (по смыслу) [web:28]

export const SignUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email обязателен" })
    .email({ message: "Неверный формат email" })
    .max(100, { message: "Email: максимум 100 символов" }),
  password: z
    .string()
    .min(1, { message: "Пароль обязателен" })
    .min(8, { message: "Пароль минимум 8 символов" })
    .max(100, { message: "Пароль: максимум 100 символов" })
    .regex(passwordRegex, {
      message:
        "Пароль должен содержать: заглавную букву, строчную букву, цифру, специальный символ",
    }),
});

export type SignUpFormValues = z.infer<typeof SignUpSchema>;
