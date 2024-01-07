import React from "react"
import { CurrencyCircleDollar } from "@phosphor-icons/react"


type LogoProps = {
  size: number
}

export const KnockBankLogo: React.FC<LogoProps> = ({ size }: LogoProps) => {
  return (
    <CurrencyCircleDollar size={size} className="fill-blue" />
  )
}