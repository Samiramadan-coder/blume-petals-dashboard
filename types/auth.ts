import z from "zod";
import { User } from "./shared";

type T = (key: string) => string;

export const loginSchema = (t: T) =>
  z.object({
    email: z.email({ message: t("InvalidEmail") }),
    password: z
      .string()
      .min(1, { message: t("PasswordIsRequired") })
      .min(8, { message: t("passwordMinLength") }),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;

export type LoginResponse = {
  data: { token: string; user: User };
  success: boolean;
};
