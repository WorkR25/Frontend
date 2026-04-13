import { ErrorObject } from "./ErrorResponse";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: ErrorObject;
}