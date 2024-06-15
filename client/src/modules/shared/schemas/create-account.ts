import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";


export const CreateAccountSchema = z.object({
  nome: z.string()
    .trim()
    .min(4, 'Seu nome deve conter pelo menos 4 caracteres.'),
  cpf: z.string()
    .trim()
    .length(11, 'Seu CPF deve conter 11 numeros.')
    .refine((cpfValue: string) => cpf.isValid(cpfValue), 'Cpf inválido.'),
  data_nascimento: z.coerce.date({ 
    errorMap: (issue, { defaultError } ) => ({ 
      message: issue.code === 'invalid_date' ? 'A data de nascimento é obrigatória.' : defaultError
    }) 
  }).transform((date: Date) => date.toISOString().split('T')[0]),
  senha: z.string()
    .trim()
    .min(8, 'Sua senha deve conter pelo menos 8 caracteres.')
    .refine((senha: string) => 
      /[a-z]/.test(senha), 'Sua senha deve conter pelo menos uma letra minúscula.')
    .refine((senha: string) => 
      /[A-Z]/.test(senha), 'Sua senha deve conter pelo menos uma letra maiúscula.')
    .refine((senha: string) => 
      /[0-9]/.test(senha), 'Sua senha deve conter pelo menos um numero.')
    .refine((senha: string) => 
      /\W|_/.test(senha), 'Sua senha deve conter pelo menos um caractere especial.' ),
  tipo_conta: z.string()
    .transform((value: string) => Number(value))
});

export type CreateAccountRequest = z.infer<typeof CreateAccountSchema>;