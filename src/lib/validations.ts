import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const updateProfileSchema = z.object({
  email: z.string().email("Correo inválido").optional(),
  currentPassword: z.string().min(8, "Mínimo 8 caracteres"),
  newPassword: z.string().min(8, "Mínimo 8 caracteres").optional(),
});
