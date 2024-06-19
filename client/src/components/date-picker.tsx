import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type DatePickerProps = {
  date: string;
  onChange: (...event: any[]) => void;
};

function getLastHundredYears(currentYear: number) {
  const lastHundredYears = [];
  for (let year = currentYear; year >= currentYear - 100; year--) {
    lastHundredYears.push(year);
  }
  return lastHundredYears;
}

export function DatePicker({ date, onChange }: DatePickerProps) {
  const currentDate = new Date();
  const [displayedMounth, setDisplayedMounth] = useState<Date>(
    new Date(currentDate.getFullYear(), currentDate.getMonth())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "pl-3 text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "dd/MM/yyyy") : <span>Escolha uma data</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="px-3 pt-3">
          <Select
            onValueChange={(value: string) =>
              setDisplayedMounth(
                new Date(Number(value), displayedMounth.getMonth())
              )
            }
            defaultValue={`${displayedMounth.getFullYear()}`}
          >
            <SelectTrigger>
              <SelectValue placeholder={`${displayedMounth.getFullYear()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getLastHundredYears(currentDate.getFullYear()).map(
                  (year, index) => (
                    <SelectItem key={index} value={`${year}`}>
                      {year}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          month={displayedMounth}
          onMonthChange={(mounth) => setDisplayedMounth(mounth)}
          selected={new Date(date)}
          onSelect={onChange}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
