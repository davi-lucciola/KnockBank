import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toBrasilianReal(value: number): string | undefined {
  return value != undefined
    ? value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : undefined;
}

export const formatCpf = (value: string) => {
  const cleanedValue = value.replace(/\D/g, ''); // remove caracteres não numéricos
  return cleanedValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};