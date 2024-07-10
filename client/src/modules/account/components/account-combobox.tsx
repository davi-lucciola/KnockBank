"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { BaseAccount, AccountQuery } from "@/modules/account/schemas/account";

type AccountsComboboxProps = {
  value: number;
  setAccountId: (accountId: number) => void;
};

export function AccountCombobox({
  value,
  setAccountId,
}: AccountsComboboxProps) {
  const { getAccounts } = useContext(AccountContext);
  const [open, setOpen] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<BaseAccount[]>([]);
  const [commandSearch, setCommandSearch] = useState<string>("");

  useEffect(() => {
    const query: AccountQuery = {
      search: commandSearch,
    };
    getAccounts(query).then((data) => setAccounts(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandSearch]);

  return (
    <Popover open={open} onOpenChange={(open: boolean) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          {value
            ? accounts.find((account) => account.id == value)?.person.name
            : "Selecione uma Conta"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[462px]">
        <Command className="w-full" shouldFilter={false}>
          <CommandInput
            placeholder="Pesquise uma conta..."
            value={commandSearch}
            onValueChange={setCommandSearch}
          />
          <CommandList>
            <CommandEmpty>Não há resultados para mostrar.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  className="flex flex-col items-start cursor-pointer"
                  onSelect={() => {
                    setAccountId(account.id);
                    setOpen(false);
                  }}
                >
                  <p>{account.person.name}</p>
                  <small className="font-bold">{account.person.cpf}</small>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
