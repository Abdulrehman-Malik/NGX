import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "./password";

export const loginSchema = z.object({
  usernameOrEmail: z.string().trim().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Used when creating/setting a password (not login, where we just check it matches). */
export const passwordPolicySchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
