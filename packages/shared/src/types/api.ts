// Common types
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface CommonApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends CommonApiResponse<T> {
  pagination: Pagination;
}
