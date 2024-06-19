import { CurrencyCircleDollar } from "@phosphor-icons/react/dist/ssr"

type LogoProps = {
  size: number
}

export function KnockBankLogo({ size }: LogoProps) {
  return (
    <CurrencyCircleDollar size={size} className="fill-primary" />
  )
}