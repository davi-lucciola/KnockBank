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

export function formatCpf(value: string, removeChars: boolean = true): string {
  if (removeChars) {
    value = value.replace(/\D/g, ""); // remove caracteres não numéricos
  }
  
  return value
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export function formatBrasilianReal(value: string): string {
  const money = Number(value.replace(/[^0-9]/g, "")) / 100;

  if (isNaN(money)) {
    return "";
  }

  return money.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
