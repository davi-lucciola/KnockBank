import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";


export const UserLoginSchema = z.object({
  cpf: z.string()
    .trim()
    .length(11, 'Seu CPF deve conter 11 numeros.')
    .refine((cpfValue: string) => cpf.isValid(cpfValue), 'Cpf inválido.'),
  senha: z.string()
    .trim()
    .min(8, 'Sua senha deve conter pelo menos 8 caracteres.'),
})

export type UserLogin = z.infer<typeof UserLoginSchema>;