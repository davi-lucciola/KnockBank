export type PaginationQuery = {
  pageSize?: number;
  pageIndex?: number;
};

export type PaginationResponse<T> = {
  data: T[];
  total: number;
  pageSize: number;
  pageIndex: number;
  totalPages: number;
};
