import { z } from "zod";

export const ShiftSchema = z.object({
    id: z.optional(z.string()),
    name: z.string(),
    start_time: z.string(),
    end_time: z.string(),
});

export type ShiftType = z.infer<typeof ShiftSchema>;