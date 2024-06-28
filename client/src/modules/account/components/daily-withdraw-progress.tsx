import { Progress } from "@/components/ui/progress";
import { toBrasilianReal } from "@/lib/utils";
import { Hiddleble } from "@/components/hiddeble";

export function DailyWithdrawProgress({
  dailyWithdrawLimit,
  todayWithdraw,
}: {
  dailyWithdrawLimit?: number;
  todayWithdraw?: number;
}) {
  // const usagePercent = (todayWithdraw * 100) / dailyWithdrawLimit;
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row mb-2 items-center justify-between">
        <label
          htmlFor="daily-withdraw-progress"
          className="text-xl font-semibold"
        >
          Limite de Saque Diário
        </label>
        <div className="text-lg font-medium flex flex-row gap-2 items-center">
          <Hiddleble className="w-16 h-6 shadow-md">
            <span> {toBrasilianReal(todayWithdraw!)} </span>
          </Hiddleble>
          <span> / </span>
          <Hiddleble className="w-16 h-6 shadow-md">
            <span> {toBrasilianReal(dailyWithdrawLimit!)} </span>
          </Hiddleble>
        </div>
      </div>
      <Progress
        id="daily-withdraw-progress"
        className="h-6"
        value={todayWithdraw}
        max={dailyWithdrawLimit}
      />
    </div>
  );
}
