export interface ApiResponse<T> {
  data: T;
  error: ExceptionResponse;
  meta: Metadata;
}

export interface ExceptionResponse {
  code: string;
  message: string;
}

export interface Metadata {
  timestamp: string;
}
