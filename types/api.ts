/**
 * Centralized API response contract.
 * Every API route should resolve to one of these shapes so the frontend
 * can rely on a single, predictable envelope regardless of endpoint.
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiMeta {
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
