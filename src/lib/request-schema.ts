import { z } from "zod";

export const contactMethods = ["simi", "netfang"] as const;

export const requestSchema = z.object({
  name: z.string().trim().min(2, "Skrifaðu nafnið þitt.").max(100, "Nafnið er of langt."),
  contact: z
    .string()
    .trim()
    .min(1, "Skrifaðu símanúmer eða netfang svo við getum haft samband.")
    .max(120, "Of langt.")
    .refine(
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[\d\s-]{7,15}$/.test(v),
      "Þetta lítur ekki út eins og símanúmer eða netfang.",
    ),
  vehicle: z.string().trim().min(2, "Hvaða bíll er þetta? Tegund og árgerð duga.").max(120, "Of langt."),
  message: z.string().trim().min(10, "Lýstu aðeins hvað er að — nokkur orð duga.").max(2000, "Lýsingin má vera í mesta lagi 2000 stafir."),
  method: z.enum(contactMethods, { message: "Veldu hvernig við eigum að hafa samband." }),
});

export type RequestFields = z.infer<typeof requestSchema>;

export type RequestState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<keyof RequestFields, string>>; values: Partial<RequestFields> }
  | { status: "sent" }
  | { status: "not_configured" }
  | { status: "rate_limited" }
  | { status: "failed" };
