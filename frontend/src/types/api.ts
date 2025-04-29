export interface ApiResponse<T> {
  data: T;
  error: ExceptionResponse;
  meta: Metadata;
}

interface ExceptionResponse {
  code: string;
  message: string;
}

interface Metadata {
  timestamp: string;
}
