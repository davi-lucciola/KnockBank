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
