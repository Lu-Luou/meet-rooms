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

export const reservationSchema = z.object({
  title: z.string().min(1, "Nombre del evento debe tener al menos 1 carácter").max(100, "Nombre del evento muy largo"),
  description: z.string().max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
  roomId: z.string().min(1, "Selecciona una sala"),
});
