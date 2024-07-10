import React from "react";
import { Input, InputProps } from "./ui/input";
import { formatBrasilianReal, toBrasilianReal } from "@/lib/utils";

export const MoneyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    return (
      <Input
        type="text"
        placeholder="R$ 10,00"
        value={formatBrasilianReal(toBrasilianReal((value as number) ?? 0)!)}
        ref={ref}
        onChange={(event) => {
          const { value } = event.target;
          event.target.value = formatBrasilianReal(value);

          if (onChange) {
            onChange(event);
          }
        }}
        {...props}
      />
    );
  }
);
MoneyInput.displayName = "Money Input";
