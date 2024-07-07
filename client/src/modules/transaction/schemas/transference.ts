import { z } from "zod";

export const BasicTransferenceSchema = z.object({
  money: z
    .string()
    .transform((value) => Number(value.replace(/[^0-9]/g, "")) / 100)
    .refine((value) => value > 0, "Você só pode transferir valores positivos"),
});

export type BasicTransferencePayload = z.infer<typeof BasicTransferenceSchema>;

export const TransferenceSchema = BasicTransferenceSchema.extend({
  accountId: z.number({required_error: "É obrigatório selecionar uma conta."}).positive(),
});

export type TransferencePayload = z.infer<typeof TransferenceSchema>;
