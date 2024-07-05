"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TransactionContext } from "@/modules/transaction/contexts/transaction-context";

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
  const { transactionsResume } = useContext(TransactionContext);

  const data = {
    labels: Array.from(
      new Set(transactionsResume.map((resume) => resume.month))
    ),
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
