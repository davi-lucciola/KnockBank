"use client";

import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TransactionList } from "@/modules/transaction/components/transaction-list";
import { TransactionContext } from "../contexts/transaction-context";
import { useUnauthorizedHandler } from "@/modules/auth/hooks/use-unauthorized-handler";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TransactionQuery } from "../schemas/transaction";

function getPageNumbers(totalPages?: number, pageIndex?: number): number[] {
  return Array.from(new Array(totalPages ?? 4), (_, index) => index + 1).filter(
    (page) => {
      const itemsQuantity = 4;
      if (
        pageIndex! > itemsQuantity / 2 &&
        pageIndex! < totalPages! - itemsQuantity / 2
      ) {
        return (
          page > pageIndex! - itemsQuantity / 2 &&
          page <= pageIndex! + itemsQuantity / 2
        );
      } else if (pageIndex! > totalPages! - itemsQuantity) {
        return page > totalPages! - itemsQuantity;
      } else {
        return page <= itemsQuantity;
      }
    }
  );
}

export function BankStatmentCard({ className }: { className: string }) {
  const { verifyToken, unauthorizedHandler } = useUnauthorizedHandler();
  const { transactions, fetchTransactions } = useContext(TransactionContext);

  const [transactionQuery, setTransactionQuery] = useState<TransactionQuery>({
    pageIndex: 1,
    pageSize: 10,
  });

  const changePage = (page: number) => {
    setTransactionQuery({
      ...transactionQuery,
      pageIndex: page,
    });
  };

  useEffect(() => {
    verifyToken();
    fetchTransactions(transactionQuery).catch(unauthorizedHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionQuery]);

  const pagesNumberArray = getPageNumbers(
    transactions?.totalPages,
    transactions?.pageIndex
  );

  return (
    <Card className={className}>
      <CardHeader className="text-2xl font-semibold">Extrato</CardHeader>
      <CardContent className="overflow-auto max-h-176 pb-0 flex-1">
        {transactions?.data.length != 0 ? (
          <TransactionList transactions={transactions?.data} />
        ) : (
          <p className="text-gray-100 font-light">
            Não há transações para visualizar.
          </p>
        )}
      </CardContent>
      <CardFooter className="p-2">
        <Pagination>
          <PaginationContent className="w-full justify-around lg:justify-center">
            <PaginationItem className="hover:cursor-pointer shrink">
              <PaginationPrevious
                onClick={() => {
                  const newPageIndex =
                    transactionQuery.pageIndex! > 1
                      ? transactionQuery.pageIndex! - 1
                      : transactionQuery.pageIndex!;

                  changePage(newPageIndex);
                }}
              />
            </PaginationItem>
            {pagesNumberArray.map((page: number, index: number) => (
              <PaginationItem key={index} className="hover:cursor-pointer">
                <PaginationLink
                  onClick={(event: any) => {
                    event.preventDefault();
                    changePage(page);
                  }}
                  isActive={page == transactions?.pageIndex!}
                  className="lg:w-full lg:min-w-5 xl:shrink-0 xl:w-10"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem className="hover:cursor-pointer shrink">
              <PaginationNext
                onClick={() => {
                  const newPageIndex =
                    transactionQuery.pageIndex! < transactions?.totalPages!
                      ? transactionQuery.pageIndex! + 1
                      : transactionQuery.pageIndex!;

                  changePage(newPageIndex);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
