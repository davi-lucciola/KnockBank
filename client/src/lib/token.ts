import { parseCookies } from "nookies";

export function getToken() {
  const { "knock-bank.token": token } = parseCookies();
  return token;
}
