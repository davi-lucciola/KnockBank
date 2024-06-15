import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";

export const LoginUserSchema = z.object({
  cpf: z
    .string()
    .trim()
    .length(11, "Seu CPF deve conter 11 numeros.")
    .refine((cpfValue: string) => cpf.isValid(cpfValue), "Cpf inválido."),
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
