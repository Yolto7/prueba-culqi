import { z } from 'zod';

const tokenSchema = z.object({
  token: z
    .string()
    .min(16)
    .max(16)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([A-Za-z0-9]){16}$/),
});

export function validateToken(payload: any) {
  return tokenSchema.safeParse(payload);
}
