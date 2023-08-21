import { z } from 'zod';

const cardSchema = z.object({
  email: z
    .string()
    .min(5)
    .max(100)
    .regex(/gmail\.com|yahoo\.com|hotmail\.com$/),
  card_number: z.string().min(13).max(16),
  cvv: z.string().regex(/^[0-9]{3,4}$/),
  expiration_month: z.string().regex(/^(0?[1-9]|1[012])$/),
  expiration_year: z.string().regex(/^\d{4}$/),
});

export function validateCard(payload: any) {
  return cardSchema.safeParse(payload);
}
