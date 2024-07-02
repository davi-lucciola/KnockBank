import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";

export const LoginUserSchema = z.object({
  cpf: z
    .string()
    .trim()
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return replacedDoc.length == 11;
    }, "Seu CPF deve conter 11 caracteres.")
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return !!Number(replacedDoc);
    }, "Seu CPF deve conter apenas números.")
    .refine((cpfValue: string) => cpf.isValid(cpfValue), "Cpf inválido.")
    .transform((doc) => doc.replace(/\D/g, "")),
  password: z
    .string()
    .trim()
    .min(8, "Sua senha deve conter pelo menos 8 caracteres."),
});

export type LoginUserPayload = z.infer<typeof LoginUserSchema>;

export type LoginUserResponse = {
  type: string;
  accessToken: string;
};
