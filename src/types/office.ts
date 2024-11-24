import { z } from "zod";

export const OfficeSchema = z.object({
    id: z.optional(z.string()),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    radius: z.number(),
});

export type OfficeType = z.infer<typeof OfficeSchema>;