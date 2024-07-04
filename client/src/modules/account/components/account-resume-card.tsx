import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { useUnauthorizedHandler } from "@/modules/auth/hooks/use-unauthorized-handler";
import { TransactionMonthResume } from "@/modules/account/schemas/transaction-month-resume";
import { AccountService } from "@/modules/account/services/account-service";
import { Api } from "@/lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type AccountResumeCardProps = {
  className: string;
};

export function AccountResumeCard({ className }: AccountResumeCardProps) {
  const { getToken } = useContext(AuthContext);
  const { verifyToken, unauthorizedHandler } = useUnauthorizedHandler();
  const [transactionsResume, setTransactionsResume] = useState<
    TransactionMonthResume[]
  >([]);

  useEffect(() => {
    verifyToken();
    const accountService = new AccountService(new Api(getToken() ?? undefined));

    const transactionsResumePromise = accountService.getAccountResume();
    transactionsResumePromise
      .then((data) => setTransactionsResume(data))
      .catch(unauthorizedHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = {
    labels: Array.from(new Set(transactionsResume.map((resume) => resume.month))),
    datasets: [
      {
        label: "Entrada",
        data: transactionsResume
          .filter((resume) => resume.label == "Entrada")
          .map((resume) => resume.amount),
        borderColor: "#50AF47",
        backgroundColor: "#50AF47",
      },
      {
        label: "Saída",
        data: transactionsResume
          .filter((resume) => resume.label == "Saída")
          .map((resume) => resume.amount),
        borderColor: "#E25858",
        backgroundColor: "#E25858",
      },
    ],
  };

  return (
    <Card className={className}>
      <CardHeader className="text-2xl font-semibold">Resumo</CardHeader>
      <CardContent className="relative h-full lg:max-h-80">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
            scales: {
              y: {
                display: false,
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
