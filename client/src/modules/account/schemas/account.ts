import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";
import { PaginationQuery } from "@/lib/pagination";
import { Person } from "@/modules/account/schemas/person";

export enum AccountType {
  CURRENT_ACCOUNT = 1,
  SAVING_ACCOUNT = 2,
  SALARY_ACCOUNT = 3,
  PAYMENT_ACCOUNT = 4,
}

export type BaseAccount = {
  id: number;
  flActive: boolean;
  person: Person;
};

export type Account = BaseAccount & {
  balance: number;
  dailyWithdrawLimit: number;
  todayWithdraw: number;
  accountType: AccountType;
};

export type AccountQuery = PaginationQuery & {
  search: string;
};

export const UpdateAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, "Seu nome deve conter pelo menos 4 caracteres."),
  birthDate: z.coerce
    .date({
      errorMap: (issue, { defaultError }) => ({
        message:
          issue.code === "invalid_date"
            ? "A data de nascimento é obrigatória."
            : defaultError,
      }),
    })
    .transform((date: Date) => date.toISOString().split("T")[0]),
  accountType: z.number(),
  dailyWithdrawLimit: z.coerce
    .string()
    .transform((value) =>
      isNaN(Number(value))
        ? Number(value.replace(/[^0-9]/g, "")) / 100
        : Number(value)
    )
    .refine(
      (value) => value >= 0,
      "Você só pode transferir valores positivos."
    ),
});

export type UpdateAccountPayload = z.infer<typeof UpdateAccountSchema>;

export const CreateAccountSchema = UpdateAccountSchema.omit({
  dailyWithdrawLimit: true,
}).extend({
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
    .min(8, "Sua senha deve conter pelo menos 8 caracteres.")
    .refine(
      (senha: string) => /[a-z]/.test(senha),
      "Sua senha deve conter pelo menos uma letra minúscula."
    )
    .refine(
      (senha: string) => /[A-Z]/.test(senha),
      "Sua senha deve conter pelo menos uma letra maiúscula."
    )
    .refine(
      (senha: string) => /[0-9]/.test(senha),
      "Sua senha deve conter pelo menos um numero."
    )
    .refine(
      (senha: string) => /\W|_/.test(senha),
      "Sua senha deve conter pelo menos um caractere especial."
    ),
});

export type CreateAccountPayload = z.infer<typeof CreateAccountSchema>;
